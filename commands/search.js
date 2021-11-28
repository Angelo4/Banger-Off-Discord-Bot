module.exports = {
    name: 'search',
    description: 'Gets the top 3 results for a song without submitting to a poll.',
    aliases: [],
    usage: '[Song Name and (optional) Artist]', 
    args: false,
    execute(message, args, main) {
        main.spotify.searchTrack(args.join(' '))
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

                message.reply({embeds: trackEmbeddedMessages});
            })
            .catch((err) => {
                //Look into error logging in the future
                console.log(err);
                message.reply("Sorry something went wrong while searching. Please try again later.");
            });
    },
};