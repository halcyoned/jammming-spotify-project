const clientId = '';
const redirectUri = 'https://codecademy_jamming_project.surge.sh';
// const redirectUri = 'http://localhost:3000/';
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        };

        let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            let expiresIn = Number(expiresInMatch[1]);
            //This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            .then(response1 => {
                if (response1.ok) {
                    console.log('GET Search API request passed');
                    return response1.json();
                } else {
                    console.log('GET Search API request failed');
                };
            })
            .then(jsonResponse1 => {
                if (!jsonResponse1.tracks) {
                    return [];
                }
                return jsonResponse1.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            })
    },

    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs.length) {
            return;
        };
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;
        return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
            .then(response2 => {
                if (response2.ok) {
                    console.log('GET userId API request passed');
                    return response2.json();
                } else {
                    console.log('GET userId API request failed');
                }
            })
            .then(jsonResponse2 => {
                userId = jsonResponse2.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ name: playlistName })
                    })
                    .then(response3 => {
                        if (response3.ok) {
                            console.log('POST playlist API request passed');
                            return response3.json();
                        } else {
                            console.log('POST playlist API request failed');
                        }
                    })
                    .then(jsonResponse3 => {
                        const playlistId = jsonResponse3.id;
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                            {
                                headers: headers,
                                method: 'POST',
                                body: JSON.stringify({ uris: trackURIs })
                            })
                    })
            })
    }
};

export default Spotify;