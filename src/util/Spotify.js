let userAccessToken = "";
const clientID = "a118b18ca2e7404faa559cb8f6e2ae58";
const redirectURI = "sedate-iron.surge.sh";
const Spotify = {
  getAccessToken(userAccessToken) {
    if (userAccessToken) {
      return userAccessToken;
    } else {

      let currentURI = window.location.href;
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {

        userAccessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);
        window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');

        return userAccessToken;

      } else {

        window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

      }
    }
  },
  search(searchTerm) {
    const userAccessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
          headers: { Authorization: `Bearer ${userAccessToken}` }
        }).then(response => {
      return response.json();
    }).then(jsonResponse =>{
      if (jsonResponse.tracks) {
    //    console.log(jsonResponse.tracks);
       return jsonResponse.tracks.items.map(track => ({
         id: track.id,
         name: track.name,
         artist: track.artists[0].name,
         album: track.album.name,
         uri: track.uri
       }));
     }
   });
},
savePlayList(playlistName, trackURIs) {
  if (!(playlistName) || !(trackURIs.length)) {
    return;
  }

  const accessToken = Spotify.getAccessToken();
  const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
  }
  let userID = '';
  return fetch('https://api.spotify.com/v1/me', {headers: headers}
  ).then(response => response.json()
  ).then(jsonResponse => {
    userID = jsonResponse.id;
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({playlistName: playlistName})
    }).then(response => response.json()
    ).then(jsonResponse => {
      const playlistID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({uris: trackURIs})
      });
    });
  });
}
}

export default Spotify;
