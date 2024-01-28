const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const fs = require('fs')
const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

const spotifyApi = new SpotifyWebApi({
  redirectUri: 'http://localhost:8888/callback',
  clientId: '44c0146f19f34258862642ab88d4c2e4',
  clientSecret: 'e9822623f6d64c4a80b3ca3345e59884'
});

const app = express();

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;
  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      function getMydata(){
        (async() => {
            const me = await spotifyApi.getMe();
           // console.log(me);
           getUserToptracks(me.body.id);
        })().catch(e =>{
            console.error(e);
        });
    }
    
    async function getUserToptracks (userName){
        const dataraw = await spotifyApi.getMyTopTracks(userName);
        console.log(dataraw.body)
        var obj = {
            table : []
        }
        for (let trackss of dataraw.body.items) {  
            obj.table.push(trackss.name)
        }
        fs.writeFileSync('myjsonfile.json', JSON.stringify(obj));
    }
    
    getUserToptracks();


      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);


      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);

      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  )
);
console.log('Before writing to JSON file');
