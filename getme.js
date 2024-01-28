const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node')
const token = ('BQDV9Cwjo3Y0d3g7AhXGhWD-uJBdGQ0W5w-4FfnwCFi45C5EsUbsDRYliEk1YErwdYvl3IOt8UvrSFrS2Zq9AgxqKLLVApQ0cr1SFuX5a013QJM7GpaRtCHk0-sGMenSd92gEOnLFGFgtNeC2Sjlza9X_YNWh8MgMcjltJAUUFrtJ8kGFpv2A8yM9tQLsZsiifdgCfQVVqLp40ztpP4kffO8mfRpWkVwNe785jRinipe_HJUCf5Dj7VdXZTvZDv9Io8BA-T_egfL5_VR9qkV-AvA05glN_0iBtTv9p3zzW1pf2lx3_jFRvug1BguWv8uWw8mG6hn93Eu1GnI3SmK')
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);


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