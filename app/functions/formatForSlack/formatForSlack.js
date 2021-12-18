'use strict';
const dynamoScanAllRows = require('../../utils/dynamoScanAllRows/dynamoScanAllRows');
const dynamoFetchSingleItem = require('../../utils/dynamoFetchSingleItem/dynamoFetchSingleItem');
const dynamoDeleteSingleItem = require('../../utils/dynamoDeleteSingleItem/dynamoDeleteSingleItem');
const dynamoCreateItem = require('../../utils/dynamoCreateItem/dynamoCreateItem');
const dynamoUpdateItem = require('../../utils/dynamoUpdateItem/dynamoUpdateItem');

const formatForSlack = (imageUrl, caption) => {
    const pictureText = caption && caption.length > 0 ? caption : 'SlalomPets';
    const body = {
        response_type: 'in_channel',
        blocks: [
            {
                type: 'image',
                title: {
                    type: "plain_text",
                    text: pictureText,
                    emoji: true
                },
                image_url: imageUrl,
                alt_text: pictureText
            }
        ]
    }

    return body;
}

module.exports = formatForSlack;