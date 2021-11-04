var SpotifyWebApi = require('spotify-web-api-node');

// SPOTIFY SNIPPETS - TODO: MOVE OUT OF index.js
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

function setAccessToken() {
    spotifyApi.clientCredentialsGrant()
        .then((data) => {
            console.log('Spotify Access Token: ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
        })
        .catch(() => {
            console.log('Something went wrong when retrieving an access token', err);
        });
}

const searchTrack = (query) => {
    return spotifyApi.searchTracks(query, { limit: 3 }) //Limit to top 3 results for bot
        .then((data) => {
            return data.body.tracks.items;
        })
        .catch((err) => {
            if (err.statusCode === 401) {
                setAccessToken();
                return searchTrack(query);
            }
        });
}

module.exports = {
    searchTrack
}