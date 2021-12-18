'use strict';
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const dynamoCreateItem = (tableName, tableUniqueKey, insertObject) => {
  console.log('Creating Record in DynamoDB Table');
  insertObject[tableUniqueKey] = uuidv4();

  const dataInfo = {
    TableName: tableName,
    Item: insertObject,
  };
  return dynamoDb.put(dataInfo).promise()
    .then(res => insertObject[tableUniqueKey]);
};

module.exports = dynamoCreateItem;