const { Intents } = require('discord.js');

const {
    DIRECT_MESSAGES,
    GUILD_MESSAGES,
    GUILDS,
    GUILD_MESSAGE_REACTIONS,
} = Intents.FLAGS;

const botIntents = [
    DIRECT_MESSAGES,
    GUILD_MESSAGES,
    GUILDS,
    GUILD_MESSAGE_REACTIONS,
];

const prefix = 'bo!';

module.exports = { botIntents, prefix };