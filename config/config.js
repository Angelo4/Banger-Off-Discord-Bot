const { Intents } = require('discord.js');

const {
    DIRECT_MESSAGES,
    GUILD_MESSAGES,
    GUILDS,
} = Intents.FLAGS;

const botIntents = [
    DIRECT_MESSAGES,
    GUILD_MESSAGES,
    GUILDS,
];

const prefix = 'bo!';

module.exports = { botIntents, prefix };