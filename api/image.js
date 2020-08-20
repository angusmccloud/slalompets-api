'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  const requestBody = JSON.parse(event.body);
  const image = requestBody.image;
  const theme = requestBody.theme;
  const caption = requestBody.caption;

  if (typeof image !== 'string' || typeof theme !== 'string' || typeof caption !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit image because you didn\'t pass all 3 required fields: image, theme, and caption.'));
    return;
  }

  submitImageP(image, theme, caption)
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
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  const theme = event.pathParameters.theme;

  var params = {
    TableName: process.env.IMAGE_TABLE,
    ProjectionExpression: "imageUrl, caption",
    FilterExpression: 'activeFlag = :active and theme = :theme',
    ExpressionAttributeValues : {
      ':active': true,
      ':theme': theme,
    }
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
          blocks: [
            {
              type: 'image',
              title: {
                type: "plain_text",
                text: image.caption,
                emoji: true
              },
              image_url: image.imageUrl,
              alt_text: image.caption
            }
          ]
        })
      });
    }

  };
  dynamoDb.scan(params, onScan);
};

module.exports.delete = (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  const imageId = event.pathParameters.id;

	if (typeof imageId !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t delete image because of validation errors.'));
    return;
  }

  deleteImageP(imageId)
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully deleted Image with id ${imageId}`
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to delete Image with id ${imageId}`
        })
      })
    });
};

module.exports.list = (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  var params = {
    TableName: process.env.IMAGE_TABLE,
    ProjectionExpression: "imageId, caption, theme, imageUrl, submittedAt, updatedAt",
    FilterExpression: 'activeFlag = :active',
    ExpressionAttributeValues : {
      ':active': true,
    }
  };

  console.log("Scanning Image table");
  const onScan = (err, data) => {
    if (err) {
      console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
      callback(err);
    } else {
      console.log("Scan succeeded.");
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          images: data.Items
        })
      });
    }
  };
  dynamoDb.scan(params, onScan);
};


module.exports.listTheme = (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  const theme = event.pathParameters.theme;

  var params = {
    TableName: process.env.IMAGE_TABLE,
    ProjectionExpression: "imageId, imageUrl, caption, submittedAt, updatedAt",
    FilterExpression: 'activeFlag = :active and theme = :theme',
    ExpressionAttributeValues : {
      ':active': true,
      ':theme': theme,
    }
  };

  console.log("Scanning Image table");
  const onScan = (err, data) => {
    if (err) {
      console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
      callback(err);
    } else {
      console.log("Scan succeeded.");
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          images: data.Items
        })
      });
    }
  };
  dynamoDb.scan(params, onScan);
};

const submitImageP = (image, theme, caption) => {
  const timestamp = new Date().getTime();
  const imageData = {
    imageId: uuid.v1(),
    imageUrl: image,
    theme: theme,
    caption: caption,
    submittedAt: timestamp,
    updatedAt: timestamp,
		activeFlag: true,
  }

  console.log('Submitting Image');
  const imageInfo = {
    TableName: process.env.IMAGE_TABLE,
    Item: imageData,
  };
  return dynamoDb.put(imageInfo).promise()
    .then(res => imageData);
};

const deleteImageP = (imageId) => {
	console.log('Deleting Image');
	const timestamp = new Date().getTime();
  const imageInfo = {
    TableName: process.env.IMAGE_TABLE,
		Key: {
			"imageId": imageId
		},
    UpdateExpression: "set activeFlag = :y, updatedAt = :z",
		ExpressionAttributeValues: {
			":y": false,
      ":z": timestamp,
    }
  };
	return dynamoDb.update(imageInfo).promise()
		.then(res => timestamp);
};