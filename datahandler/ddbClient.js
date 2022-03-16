const {
    DynamoDBClient,
    UpdateItemCommand,
    GetItemCommand,
} = require('@aws-sdk/client-dynamodb')
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')

const REGION = 'ap-southeast-2'
const DYNAMODB_TABLE = 'BangerOff'

const ddbClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

const ping = () => {
    console.log('PING DYNAMODB')
}

const addSongToActivePoll = async (guildId, authorId, spotifyTrack) => {
    let submission = {
        spotifyTrack: spotifyTrack,
        submissionDetail: {
            discordUserId: authorId,
            voteCount: 0,
        },
    }

    const params = {
        TableName: DYNAMODB_TABLE,
        Key: {
            GuildID: { S: guildId },
        },
        ExpressionAttributeNames: { '#activePoll': 'activePoll' },
        ExpressionAttributeValues: {
            ':empty_list': { L: [] },
            ':submission': { L: [{ M: marshall(submission) }] },
        },
        UpdateExpression:
            'SET #activePoll = list_append(if_not_exists(#activePoll, :empty_list), :submission)',
    }

    try {
        const command = new UpdateItemCommand(params)
        const result = await ddbClient.send(command)

        if (result.httpStatusCode == 200) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.log('Error', err)
    }
}

const getActivePoll = async (guildId) => {
    const params = {
        TableName: DYNAMODB_TABLE,
        Key: {
            GuildID: { S: guildId },
        },
    }

    try {
        const command = new GetItemCommand(params)
        const result = await ddbClient.send(command)

        if (result.Item) {
            var bangerOffItem = unmarshall(result.Item)
            return {
                success: true,
                message: '',
                activePoll: bangerOffItem.activePoll,
            }
        } else {
            return {
                success: false,
                message: 'There are no songs currently in the poll.',
                activePoll: [],
            }
        }
    } catch (err) {
        console.log('Error', err)
    }
}

module.exports = {
    ping,
    addSongToActivePoll,
    getActivePoll,
}
