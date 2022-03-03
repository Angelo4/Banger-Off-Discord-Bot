const { millisToMinutesAndSeconds } = require('../utils/helper');
const { Formatters } = require('discord.js');

const votingEmotes = [
    '🇦',
    '🇧',
    '🇨',
    '🇩',
    '🇪',
    '🇫',
    '🇬',
    '🇭',
    '🇮',
    '🇯',
    '🇮',
    '🇰',
    // 'regional_indicator_l',
    // 'regional_indicator_m',
    // 'regional_indicator_n',
    // 'regional_indicator_o',
    // 'regional_indicator_p',
    // 'regional_indicator_q',
    // 'regional_indicator_r',
    // 'regional_indicator_s',
    // 'regional_indicator_t',
    // 'regional_indicator_u',
    // 'regional_indicator_v',
    // 'regional_indicator_w',
    // 'regional_indicator_x',
    // 'regional_indicator_y',
    // 'regional_indicator_z',
]

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
                            .setTitle('🇦 ' + submission.spotifyTrack.name)
                            .setURL(submission.spotifyTrack.external_urls.spotify) 
                            .setThumbnail(submission.spotifyTrack.album.images[0].url)
                            .setFields([
                                { name: 'Artist', value: submission.spotifyTrack.artists[0].name, inline: true },
                                { name: 'Album', value: submission.spotifyTrack.album.name, inline: true },
                                { name: 'Duration', value: millisToMinutesAndSeconds(submission.spotifyTrack.duration_ms)},
                                { name: 'Release Date', value: submission.spotifyTrack.album.release_date },
                            ])
                            .setDescription('Submitted by ' + Formatters.userMention(submission.submissionDetail.discordUserId));
                    });    

                    message.reply({content: 'Here are the polls song submissions!', embeds: trackEmbeddedMessages})
                        .then((message) => {                            
                            for (i = 0; i < trackEmbeddedMessages.length; i++) {
                                message.react(votingEmotes[i])
                            }
                            message.awaitReactions({ max: 5 })
                                .then(collected => {
                                    const reaction = collected.first();

                                    if (reaction.emoji.name === '✅') {
                                        
                                    } else {
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });                  
                        });
                }
            })
            .catch((err) => {
                //Look into error logging in the future
                console.log(err);
                message.reply('Sorry something went wrong while retrieving the active poll. Please try again later.');
            });;
    },
};