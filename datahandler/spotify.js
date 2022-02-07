var SpotifyWebApi = require('spotify-web-api-node');

// SPOTIFY SNIPPETS - TODO: MOVE OUT OF index.js
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function setAccessToken() {
    return spotifyApi.clientCredentialsGrant()
        .then((data) => {
            console.log('Spotify Access Token: ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
        })
        .catch(() => {
            console.log('Something went wrong when retrieving an access token', err);
        });
}

const searchTrack = async (query, limit) => {
    await setAccessToken();
    return spotifyApi.searchTracks(query, { limit: limit }) 
        .then((data) => {
            return data.body.tracks.items;
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    searchTrack
}