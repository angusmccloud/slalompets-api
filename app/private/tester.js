'use strict';

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

// Base Dynamo Utils
const dynamoScanAllRows = require('../utils/dynamoScanAllRows/dynamoScanAllRows');
const dynamoFetchSingleItem = require('../utils/dynamoFetchSingleItem/dynamoFetchSingleItem');
const dynamoDeleteSingleItem = require('../utils/dynamoDeleteSingleItem/dynamoDeleteSingleItem');
const dynamoCreateItem = require('../utils/dynamoCreateItem/dynamoCreateItem');
const dynamoUpdateItem = require('../utils/dynamoUpdateItem/dynamoUpdateItem');

// Other Utils
const cognitoGetAllUsers = require('../utils/cognitoGetAllUsers/cognitoGetAllUsers');
const getUserId = require('../utils/getUserId/getUserId');

// App-Specific Functions


module.exports.tester = async () => { 
    // Down here call a function, see what happens
};

