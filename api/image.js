'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const image = requestBody.image;

  if (typeof image !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit image because of no image URL was passed.'));
    return;
  }

  submitImageP(image)
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Successfully submitted new image with URL ${image}`,
          imageId: res.imageId
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit new image with URL ${image}`
        })
      })
    });
};

module.exports.get = (event, context, callback) => {
  var params = {
    TableName: process.env.IMAGE_TABLE,
    ProjectionExpression: "imageUrl"
  };

  console.log("Scanning Image table.");
  const onScan = (err, data) => {

    if (err) {
      console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
      callback(err);
    } else {
      console.log("Scan succeeded.");
      var imageArray = data.Items;
      var image = imageArray[Math.floor(Math.random()*imageArray.length)];
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          response_type: 'in_channel',
          attachments: [
            {
              fallback: process.env.fallbackText,
              color: process.env.commandColor,
              image_url: image.imageUrl,
              thumb_url: image.imageUrl
            }
          ]
        })
      });
    }

  };
  dynamoDb.scan(params, onScan);
};

const submitImageP = (image) => {
  const imageData = {
    imageId: uuid.v1(),
    imageUrl: image,
  }

  console.log('Submitting Image');
  const imageInfo = {
    TableName: process.env.IMAGE_TABLE,
    Item: imageData,
  };
  return dynamoDb.put(imageInfo).promise()
    .then(res => imageData);
};