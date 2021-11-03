require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { botIntents, commands, prefix } = require('./config/config.js');
const config = require('./config/default.js');
const ddbClient = require('./datahandler/ddbClient.js');
var SpotifyWebApi = require('spotify-web-api-node');

console.log(process.env.SPOTIFY_CLIENT_ID);

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(
        function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
    
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
        console.log('Something went wrong when retrieving an access token', err);
        }
    )
    .then(
        function() {
            spotifyApi.searchTracks('MONEY', { limit: 3 })
                .then(function(data) {
                    console.log(data);
                    console.log('Search by "Money"', data.body);
                }, function(err) {
                    console.error(err);
                });
        }
    );

// Set the parameters.
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
  
async function run() {
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
run();

const client = new Client({
    intents: botIntents,
    partials: ['CHANNEL', 'MESSAGE'],
});

client.on('ready', () => {
    console.log('Logged in as ' + client.user.tag);
});

client.login(config.DISCORD_TOKEN);

const customEmbed = new MessageEmbed()
    .setTitle('MONEY')
    .setURL('https://open.spotify.com/track/7hU3IHwjX150XLoTVmjD0q') //Spotify Track URL
    .setThumbnail('https://i.scdn.co/image/ab67616d0000b273330f11fb125bb80b760f9e19')
    .setFields([
        { name: 'Artist', value: 'LISA', inline: true },
        { name: 'Album', value: 'LALISA', inline: true },
		{ name: 'Song Duration', value: '2:48', inline: true },
		{ name: 'Release Date', value: '2021-09-10', inline: true },
    ]);

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return; 
    if (!msg.content.startsWith(prefix)) return; // do nothing if command is not preceded with prefix
  
    const userCmd = msg.content.slice(prefix.length);
    msg.reply({embeds: [customEmbed]});
    console.log(msg.guildId);
});

