'use strict';
const dynamoScanAllRows = require('../../utils/dynamoScanAllRows/dynamoScanAllRows');
const dynamoFetchSingleItem = require('../../utils/dynamoFetchSingleItem/dynamoFetchSingleItem');
const dynamoDeleteSingleItem = require('../../utils/dynamoDeleteSingleItem/dynamoDeleteSingleItem');
const dynamoCreateItem = require('../../utils/dynamoCreateItem/dynamoCreateItem');
const dynamoUpdateItem = require('../../utils/dynamoUpdateItem/dynamoUpdateItem');

const addImage = (url, caption, createdTime) => {
    const newImage = {
        url,
        caption,
        createdTime: createdTime ? createdTime : new Date().getTime(),
        activeFlag: true
    };
    const result = dynamoCreateItem(process.env.IMAGE_TABLE, 'imageId', newImage);
    return result;
}

module.exports = addImage;