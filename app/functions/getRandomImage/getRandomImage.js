'use strict';
const shuffle = require('shuffle-array');
const dynamoScanAllRows = require('../../utils/dynamoScanAllRows/dynamoScanAllRows');
const dynamoFetchSingleItem = require('../../utils/dynamoFetchSingleItem/dynamoFetchSingleItem');
const dynamoDeleteSingleItem = require('../../utils/dynamoDeleteSingleItem/dynamoDeleteSingleItem');
const dynamoCreateItem = require('../../utils/dynamoCreateItem/dynamoCreateItem');
const dynamoUpdateItem = require('../../utils/dynamoUpdateItem/dynamoUpdateItem');

const getRandomImage = async () => {
    const allImages = await dynamoScanAllRows(process.env.IMAGE_TABLE);
    await shuffle(allImages);
    const randomImage = allImages[0];
    return randomImage;
}

module.exports = getRandomImage;