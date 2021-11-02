require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { botIntents, commands, prefix } = require('./config/config.js');
const config = require('./config/default.js');
const ddbClient = require('./dynamodb_helpers/ddbClient.js')

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

const getLastMsgs = async (msg) => {
    // fetching the last 10 messages
    const res = await msg.channel.messages.fetch({ limit: 10 });
  
    const lastTenMsgs = res.map((message) => {
        return message.content;
      });
    
    const embeds = [];

    lastTenMsgs.forEach((msg, index) => {
        const embed = new MessageEmbed()
            .setColor('ORANGE') // can be hex like #3caf50
            .setTitle(`Message ${index + 1}`)
            .setDescription(`${msg}`)
            .setFooter('Buddy says Hi');
        
        embeds.push(embed);
    });

    return embeds;
};

client.on('messageCreate', async (msg) => {
    console.log(msg);
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return; // do nothing if command is not preceded with prefix
  
    const userCmd = msg.content.slice(prefix.length);
  
    if (userCmd === commands.getName) {
        msg.reply('fugg u ' + msg.author.username);
    } else if (userCmd === commands.tellJoke) {
        msg.channel.send('HTML bla bla bla');
    } else if (userCmd === commands.sad) {
        msg.reply("Don't be sad! This is not the end of the road");
    } else if (userCmd === commands.lastMsgs) {
        const reply = await getLastMsgs(msg);
        msg.channel.send({ embeds: reply });
    } else {
        msg.reply('I do not understand your command');
    }
});

