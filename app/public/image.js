'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getImageByKeywords = require('../functions/getImageByKeywords/getImageByKeywords');
const formatForSlack = require('../functions/formatForSlack/formatForSlack');
const getAllImages = require('../functions/getAllImages/getAllImages');

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

module.exports.get = async (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  console.log('-- event --', event);
  const request = event.queryStringParameters;
  const passedText = request.text;
  console.log('-- Search Term --', passedText);
  // const workspaceId = requestBody.team_id;
  // const userId = requestBody.user_id;
  // const channelId = requestBody.channel_id;

  const image = await getImageByKeywords(passedText);
  const blockForSlack = await formatForSlack(image.imageUrl, image.caption);
  console.log('-- blockForSlack --', blockForSlack);
  console.log("-- Stringified --", JSON.stringify(blockForSlack));


  const response = {
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(blockForSlack)
  };

  callback(null, response);
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

module.exports.list = async (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  const allImages = await getAllImages();

  return callback(null, {
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      images: allImages
    })
  });
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

module.exports.themeList = async (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  var fetchMoreData = true;
  var allImages = [];
  var startKey;
  var params;

  while (fetchMoreData) {
    if (!startKey) {
      params = {
        TableName: process.env.IMAGE_TABLE,
        ProjectionExpression: "theme, imageId",
        FilterExpression: 'activeFlag = :active',
        ExpressionAttributeValues: {
          ':active': true,
        }
      };
    } else {
      params = {
        TableName: process.env.IMAGE_TABLE,
        ProjectionExpression: "theme, imageId",
        FilterExpression: 'activeFlag = :active',
        ExpressionAttributeValues: {
          ':active': true,
        },
        ExclusiveStartKey: { imageId: startKey }
      };
    }

    const result = await dynamoDb.scan(params).promise();
    var thisResult = result.Items;
    allImages = allImages.concat(thisResult);
    if (result.LastEvaluatedKey) {
      startKey = result.LastEvaluatedKey.imageId;
    } else {
      fetchMoreData = false;
    }
  }

  var themes = {};
  for (var i = 0; i < allImages.length; i++) {
    var theme = allImages[i].theme;
    themes[theme] = {
      theme: theme,
      count: 0
    };
  }

  for (var i = 0; i < allImages.length; i++) {
    var theme = allImages[i].theme;
    var currentCount = themes[theme].count;

    themes[theme] = {
      theme: theme,
      count: currentCount + 1
    };
  }

  var ordered = {};
  Object.keys(themes).sort().forEach(function(key) {
    ordered[key] = themes[key];
  });

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      themes: ordered
    })
  });
};