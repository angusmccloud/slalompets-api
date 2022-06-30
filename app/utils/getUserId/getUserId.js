'use strict';

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const jwt = require('jsonwebtoken');

const getUserId = (jwtToken) => {
  const decoded = jwt.decode(jwtToken);
  const userId = decoded.sub;
  // return decoded.sub;
  return {
    validUser: true,
    userId,
  };
};

module.exports = getUserId;