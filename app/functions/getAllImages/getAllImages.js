'use strict';
const shuffle = require('shuffle-array');
const dynamoScanAllRows = require('../../utils/dynamoScanAllRows/dynamoScanAllRows');
const dynamoFetchSingleItem = require('../../utils/dynamoFetchSingleItem/dynamoFetchSingleItem');
const dynamoDeleteSingleItem = require('../../utils/dynamoDeleteSingleItem/dynamoDeleteSingleItem');
const dynamoCreateItem = require('../../utils/dynamoCreateItem/dynamoCreateItem');
const dynamoUpdateItem = require('../../utils/dynamoUpdateItem/dynamoUpdateItem');

const getAllImages = async () => {
    const allImages = await dynamoScanAllRows(process.env.IMAGE_TABLE);
    return allImages;
}

module.exports = getAllImages;