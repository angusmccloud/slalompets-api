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

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Success Playholder`,
      contentId: 'abc123'
    })
  };

  callback(null, response);
};

module.exports.get = async (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  const contentId = event.queryStringParameters.contentId;

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Success Playholder`,
      contentId: 'abc123'
    })
  };

  callback(null, response);
};

module.exports.delete = (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  const contentId = event.pathParameters.contentId;

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Success Playholder`,
      contentId: 'abc123'
    })
  };

  callback(null, response);
};

module.exports.list = async (event, context, callback) => {
  /** Immediate response for WarmUP plugin so things don't keep running */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Success Playholder`,
      contentId: 'abc123'
    })
  };

  callback(null, response);
};

