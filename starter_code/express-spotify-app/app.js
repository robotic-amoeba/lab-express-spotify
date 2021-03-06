const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const app = express();

// Remember to paste here your credentials
const clientId = '',
  clientSecret = '';

let spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
  res.render('index');
})

app.get('/artists', (req, res) => {
  let artistObj = req.query;
  spotifyApi.searchArtists(artistObj.artist)
    .then(data => {
      let artists = data.body.artists.items;
      //console.log(artists);
      res.render('artists', { artists })
    })
    .catch(err => {
      throw Error("Found a problem. Artist");
    })
})

app.get('/albums/:artistId', (req, res) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      //console.log(data.body.items[0])
      let albums = data.body.items;
      res.render('albums', { albums })
    })
    .catch(err => {
      throw Error("Found a problem. Albums")
    })
})

app.get('/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId;
  console.log(albumId);
  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      //console.log(data);
      let tracks = data.body.items
      //console.log(tracks[2]);
      res.render('tracks', { tracks })
    })

})


app.listen(3000, () => {
  console.log("Listening")
}); 
