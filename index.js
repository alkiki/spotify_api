
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const fs = require('fs')

const spotifyApi = new SpotifyWebApi({
  redirectUri: 'http://localhost:8888/callback',
  clientId: '44c0146f19f34258862642ab88d4c2e4',
  clientSecret: 'e9822623f6d64c4a80b3ca3345e59884'
});

const app = express();
const authorizationCode =
  'AQDxe2mIt2D0rxb1PKp94oiA_YMfFV8PFebBbHKwXiChMR-PwBdHzpOqXLJlRrAGyf3FjxEzFLWm2omJVwag8VrM5F6TrERDOdt4kviNKcZzSitdtHgGimCgtL69k9jHz6JgFQHuh0r9mbOW1EDvztU5c6vJMI9rzXA42jy6NTz7LB2zJH5yKgW3cD3yp2iSbQ';
// When our access token will expire
let tokenExpirationEpoch;

// function writeTopTracksToFile(data) {
//   const jsonData = JSON.stringify(data, null, 2); // Add formatting for better readability
//   fs.writeFile('top_tracks.json', jsonData, 'utf8', (err) => {
//     if (err) {
//       console.error('Error writing to file:', err);
//     } else {
//       console.log('Top tracks data has been written to top_tracks.json');
//     }
//   });
// }


// First retrieve an access token
spotifyApi.authorizationCodeGrant(authorizationCode).then(
  function(data) {
    // Set the access token and refresh token
    const refresh_token = data.body['refresh_token'];
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    // Save the amount of seconds until the access token expired
    tokenExpirationEpoch =
      new Date().getTime() / 1000 + data.body['expires_in'];
    console.log(
      'Retrieved token. It expires in ' +
        Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
        ' seconds!'
    );
   // getUserTopTracks();
  },
  function(err) {
    console.log(
      'Something went wrong when retrieving the access token!',
      err.message
    );
  }
);

// Continually print out the time left until the token expires..
let numberOfTimesUpdated = 0;

setInterval(function() {
  console.log(
    'Time left: ' +
      Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
      ' seconds left!'
  );

  // OK, we need to refresh the token. Stop printing and refresh.
  if (++numberOfTimesUpdated > 5) {
    clearInterval(this);

    // Refresh token and print the new time to expiration.
    spotifyApi.refreshAccessToken().then(
      function(data) {
        tokenExpirationEpoch =
          new Date().getTime() / 1000 + data.body['expires_in'];
        console.log(
          'Refreshed token. It now expires in ' +
            Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
            ' seconds!'
        );
       // getUserTopTracks();
      },
      function(err) {
        console.log('Could not refresh the token!', err.message);
      }
    );
  }
}, 1000);


// function getMydata(){
//   (async() => {
//       const me = await spotifyApi.getMe();
//      // console.log(me);
//      getUserToptracks(me.body.id);
//   })().catch(e =>{
//       console.error(e);
//   });
// }

// async function getUserToptracks (userName){
//   const dataraw = await spotifyApi.getMyTopTracks(userName);
//   console.log(dataraw.body)
//   var obj = {
//       table : []
//   }
//   for (let trackss of dataraw.body.items) {  
//       obj.table.push(trackss.name)
//   }
//   fs.writeFileSync('myjsonfile.json', JSON.stringify(obj));
// }

// getUserToptracks();