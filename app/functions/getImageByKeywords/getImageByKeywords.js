'use strict';
const shuffle = require('shuffle-array');
const dynamoScanAllRows = require('../../utils/dynamoScanAllRows/dynamoScanAllRows');
const dynamoFetchSingleItem = require('../../utils/dynamoFetchSingleItem/dynamoFetchSingleItem');
const dynamoDeleteSingleItem = require('../../utils/dynamoDeleteSingleItem/dynamoDeleteSingleItem');
const dynamoCreateItem = require('../../utils/dynamoCreateItem/dynamoCreateItem');
const dynamoUpdateItem = require('../../utils/dynamoUpdateItem/dynamoUpdateItem');

const getImageByKeywords = async (keywords) => {
    const allImages = await dynamoScanAllRows(process.env.IMAGE_TABLE);
    let keywordsArray = keywords.split(/[\s,]/);
    keywordsArray = keywordsArray.filter(word => word.length > 0);
    keywordsArray = keywordsArray.map(word => word.toLowerCase());
    const matchesAll = [];
    const matchesAny = [];
    for (let i = 0; i < allImages.length; i++) {
        const image = allImages[i];
        let imageKeywords = image.caption.split(/[\s,]/);
        imageKeywords = imageKeywords.filter(word => word.length > 0);
        imageKeywords = imageKeywords.map(keyword => keyword.toLowerCase());
        const matchesAllFlag = keywordsArray.every(keyword => imageKeywords.includes(keyword));
        const matchesAnyFlag = keywordsArray.some(keyword => imageKeywords.includes(keyword));
        if (matchesAllFlag) {
            matchesAll.push(image);
        }
        if (matchesAnyFlag) {
            matchesAny.push(image);
        }
    }
    if (matchesAll.length > 0) {
        await shuffle(matchesAll);
        return matchesAll[0];
    } else if (matchesAny.length > 0) {
        await shuffle(matchesAny);
        return matchesAny[0];
    } else {
        await shuffle(allImages);
        return allImages[0];
    }
}

module.exports = getImageByKeywords;