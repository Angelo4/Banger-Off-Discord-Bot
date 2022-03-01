const { DynamoDBClient, UpdateItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');

const REGION = "ap-southeast-2"; 
const DYNAMODB_TABLE = "BangerOff";

const ddbClient = new DynamoDBClient({ 
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const addSongToActivePoll = async (guildId, songName) => {
    const params = {
        TableName: DYNAMODB_TABLE,
        Key: {
            GuildID: {N: guildId}
        },
        ExpressionAttributeValues: { 
            ":song": {S: songname}
        },
        UpdateExpression: "SET SongName = :song"
    };

    try {
        const command = new UpdateItemCommand(params);
        const result = await ddbClient.send(command);   

        if (result.httpStatusCode == 200){
            return true;
        } else {
            return false;
        }
    } catch (err){
        console.log("Error", err);
    }
}

const run = async () => {
    const params = {
        // Specify which items in the results are returned.
        FilterExpression: "FirstName = :F AND LastName = :L",
        // Define the expression attribute value, which are substitutes for the values you want to compare.
        ExpressionAttributeValues: {
          ":F": { S: "Angelo" },
          ":L": { S: "Alcantara" },
        },
        // Set the projection expression, which the the attributes that you want.
        ProjectionExpression: "FirstName, LastName, SongName",
        TableName: "Test",
    };
    
    try {
        const data = await ddbClient.send(new ScanCommand(params));
        data.Items.forEach(function (element, index, array) {
            console.log(element);
            return data;
        });
    } catch (err) {
        console.log("Error", err);
    }
}

module.exports = {
    run,
    addSongToActivePoll
};
