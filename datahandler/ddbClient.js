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

const ping = () => {
    console.log("PING DYNAMODB");
}

const addSongToActivePoll = async (guildId, spotifyTrack) => {
    const params = {
        TableName: DYNAMODB_TABLE,
        Key: {
            GuildID: { S: guildId }
        },
        ExpressionAttributeValues: {
            ":song": { S: spotifyTrack.name }
        },
        UpdateExpression: "SET SongName = :song"
    };

    try {
        const command = new UpdateItemCommand(params);
        const result = await ddbClient.send(command);

        if (result.httpStatusCode == 200) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("Error", err);
    }
}

module.exports = {
    ping,
    addSongToActivePoll
};
