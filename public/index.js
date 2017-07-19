'use strict';

// ------------
// state object
// ------------

const state = {
  tags: []
};

function getAlbumInfo() {
  // imagine grabbing the necessary info with query params
  // query my db
  //  if the album is there, grab it
  //  otherwise, add it to the db
  fetch('http://localhost:8080/albums/')
    .then(res => console.log(res));
}





function genreSelector() {
  $('#js-genre-selector').select2({
    ajax: {
      url: 'http://localhost:8080/genres',
      dataType: 'json',
      delay: 250,
      data: function(params) {
        return {
          q: params.term, 
        };
      },
      processResults: function (data) {
        const namesArr = data.map(function(object) {
          return { id: object._id, text: object.name };
        });
        return {
          results: namesArr
        };
      },
      cache: true
    },
    minimumInputLength: 1
  });

  $('#js-genre-selector').on('select2:select', function(event) {
    const selection = event.params.data.text;
  });
}

function albumSearcher() { 
  $( '#js-album-searcher' ).autocomplete({
    source: function( request, response ) {
      let result;
      $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=9cb98547379ad2c1b5b680646cbdac53&format=json',
        dataType: 'json',
        data: {
          artist: request.term
        },
        success: function( data ) {
          console.log(data)
          result = data.topalbums.album.map(function(object) {
            return `artist: ${object.artist.name}, album: ${object.name}`;
          });
          response(result);
        }
      });
    },
    minLength: 1
  });
}

$(function() {
  genreSelector();
  albumSearcher();
});

// Application name	academic
// API key	9cb98547379ad2c1b5b680646cbdac53
// Shared secret	8d5ad4d7da3487a8bf07b5b312ecf66c
// Registered to	krp312