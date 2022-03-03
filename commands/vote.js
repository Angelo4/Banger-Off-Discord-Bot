const { millisToMinutesAndSeconds } = require('../utils/helper');
const { Formatters } = require('discord.js');

module.exports = {
    name: 'vote',
    description: 'Displays all the added songs in the active Banger Off through an embedded Spotify players. Members of the server are then able to vote on which song is a banger through reacts.',
    aliases: [],
    usage: '', //expected argument usage
    args: false,
    execute(message, args, main) {
        main.dynamodb.getActivePoll(message.channelId)
            .then((item) => {
                if (item.success) {
                    var trackEmbeddedMessages = item.activePoll.map((submission) => {
                        return new main.MessageEmbed()
                            .setTitle(submission.spotifyTrack.name)
                            .setURL(submission.spotifyTrack.external_urls.spotify) 
                            .setThumbnail(submission.spotifyTrack.album.images[0].url)
                            .setFields([
                                { name: 'Artist', value: submission.spotifyTrack.artists[0].name, inline: true },
                                { name: 'Album', value: submission.spotifyTrack.album.name, inline: true },
                                { name: 'Duration', value: millisToMinutesAndSeconds(submission.spotifyTrack.duration_ms)},
                                { name: 'Release Date', value: submission.spotifyTrack.album.release_date },
                            ])
                            .setDescription("Submitted by " + Formatters.userMention(submission.submissionDetail.discordUserId));
                    });    

                    message.reply({embeds: trackEmbeddedMessages});
                }
            })
            .catch((err) => {
                //Look into error logging in the future
                console.log(err);
                message.reply('Sorry something went wrong while retrieving the active poll. Please try again later.');
            });;
    },
};