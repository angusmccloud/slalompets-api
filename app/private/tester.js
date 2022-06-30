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
    // addImage('https://slalompets-images.s3.amazonaws.com/C8057880-90AE-4508-9951-26D9D48D524C_1539739533.jpeg', ' Connor\'s Kitties: Sherlock and Watson the day he got them', 1539739533000);
    // return await getRandomImage();
    // const image = await getImageByKeywords('sherlock watson');
    // const forSlack = await formatForSlack(image.imageUrl, image.caption);
    // return forSlack;
    // const allImages = await getAllImages();
    // return allImages
    addImage('https://slalompets-images.s3.amazonaws.com/chup1.jpg', 'Carrie\'s Kitty Chup!', 1654777641000);
    addImage('https://slalompets-images.s3.amazonaws.com/chup2.jpg', 'Carrie\'s Kitty Chup Helping with Work!', 1654777641000);
};

