const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const REGION = "ap-southeast-2"; 

const ddbClient = new DynamoDBClient({ 
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
module.exports = ddbClient;
