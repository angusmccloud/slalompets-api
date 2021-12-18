'use strict';

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const dynamoScanAllRows = async (tableName = process.env.IMAGE_TABLE, fields = 'imageId, caption, url', filterExpression = `activeFlag = :activeFlag`, expressionAttributeValues = {':activeFlag': true}, tableUniqueKey = 'imageId') => {
  console.log('Fetching All Data from DynamoDB Table');
  let fetchMoreData = true;
  let allRows = [];
  let startKey;
  let params;

  while (fetchMoreData){
    if (!startKey) {
      params = {
        TableName: tableName,
        ProjectionExpression: fields,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues
      };
    } else {
      params = {
        TableName: tableName,
        ProjectionExpression: fields,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExclusiveStartKey: { [tableUniqueKey]: startKey }
      };
    }

    // console.log('-- Filter Expression --', filterExpression);
    // console.log('-- Expression Attribute Filters --', expressionAttributeValues);
    // console.log('-- params --', params);

    const result = await dynamoDb.scan(params).promise();
    let thisResult = result.Items;
    allRows = allRows.concat(thisResult);
    if(result.LastEvaluatedKey){
      startKey = result.LastEvaluatedKey[tableUniqueKey];
    } else {
      fetchMoreData = false;
    }
  }

  return allRows;
};

module.exports = dynamoScanAllRows;