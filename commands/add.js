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
                            { name: 'Duration', value: main.millisToMinutesAndSeconds(track.duration_ms)},
                            { name: 'Release Date', value: track.album.release_date },
                        ]);
                });

                message.reply({content: 'Please confirm your song submission', embeds: trackEmbeddedMessages})
                    .then((message) => {
                        message.react('👍')
                        message.react('👎')                    
                    });
            })
            .catch((err) => {
                //Look into error logging in the future
                console.log(err);
                message.reply("Sorry something went wrong while searching. Please try again later.");
            });
    },
};