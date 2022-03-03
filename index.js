require('dotenv').config();
const { Client, MessageEmbed , Collection} = require('discord.js');
const { botIntents, prefix } = require('./config/config.js');
const fs = require('fs');
const config = require('./config/default.js');
const dynamodb = require('./datahandler/ddbClient.js');
const spotify = require('./datahandler/spotify')
const utils = require('./utils/helper.js');

let main;

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
    dynamodb,
    MessageEmbed,
}