module.exports = {
    name: 'add',
    description: 'Adds the top result of a searched song to the active poll.',
    aliases: [],
    usage: '[Song Name and (optional) Artist]', 
    args: false,
    execute(message, args, main) {
        main.spotify.searchTrack(args.join(' '), 1)
            .then((tracks) => {
                var trackEmbeddedMessages = tracks.map((track) => {
                    return new main.MessageEmbed()
                        .setTitle(track.name)
                        .setURL(track.external_urls.spotify) 
                        .setThumbnail(track.album.images[0].url)
                        .setFields([
                            { name: 'Artist', value: track.artists[0].name, inline: true },
                            { name: 'Album', value: track.album.name, inline: true },
                            { name: 'Duration', value: main.utils.millisToMinutesAndSeconds(track.duration_ms)},
                            { name: 'Release Date', value: track.album.release_date },
                        ]);
                });

                const senderId = message.author.id;
                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === senderId;
                };

                message.reply({content: 'Please confirm your song submission', embeds: trackEmbeddedMessages})
                    .then((message) => {
                        message.react('✅')
                        message.react('❌') 
                        message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '✅') {
                                    main.dynamodb.addSongToActivePoll(message.channelId, senderId, tracks[0]);
                                    message.reply('You have confirmed your banger.');
                                } else {
                                    message.reply('This song will not be submited as a banger.');
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });                  
                    });
            })
            .catch((err) => {
                //Look into error logging in the future
                console.log(err);
                message.reply("Sorry something went wrong while searching. Please try again later.");
            });
    },
};