require('dotenv').config();
const { Client, MessageEmbed , Intents, Collection} = require('discord.js');
const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { botIntents, commands, prefix } = require('./config/config.js');
const fs = require('fs');
const config = require('./config/default.js');
const ddbClient = require('./datahandler/ddbClient.js');
const spotify = require('./datahandler/spotify')

let main;

// DYNAMODB SNIPPETS - TODO: MOVE OUT OF index.js
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

const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// DISCORD BOT HANDLING
const client = new Client({
    intents: botIntents,
    partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
});

client.commands = new Collection();
client.commandsArray = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
    client.commandsArray.push(command.name);
}

client.login(config.DISCORD_TOKEN);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageReactionAdd', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

    console.log(user);
	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; 
    if (!message.content.startsWith(prefix)) return; //do nothing if command is not preceded with prefix
  
    const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

	if (!command) return;

	try {
		await command.execute(message, args, main);
	} catch (error) {
		console.error(error);
		await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

main = {
    spotify,
    MessageEmbed,
    millisToMinutesAndSeconds
}