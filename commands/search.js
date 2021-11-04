module.exports = {
    name: 'search',
    desription: 'Gets the top 3 results for a song without submitting to a poll.',
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
                        { name: 'Song Duration', value: main.millisToMinutesAndSeconds(track.duration_ms), inline: true },
                        { name: 'Release Date', value: track.album.release_date, inline: true },
                    ]);
                });

                message.reply({embeds: trackEmbeddedMessages});
            });
    },
};