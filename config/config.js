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

const commands = {
    help: 'help',
    start: 'start',
    add: 'add',
    vote: 'vote',
    end: 'end',
    abandon: 'abandon',
    get: 'get',
    leaderboard: 'leaderboard',
};

const prefix = 'bo!';

module.exports = { botIntents, commands, prefix };