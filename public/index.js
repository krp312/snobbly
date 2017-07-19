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
    const id = $('#js-album-id').val();

    $.ajax({
      url: `http://localhost:8080/albums/${id}/tags`,
      dataType: 'json',
      method: 'PUT',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        tag: selection
      }),
      success: function(data) {
        $('#js-album-search-button').trigger('click');
      }
    });    

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
          result = data.topalbums.album.map(function(object) {
            return `${object.artist.name} | ${object.name}`;
          });
          response(result);
        }
      });
    },
    minLength: 1
  });
}

// artist: LED | album: Wściekłość i wrzask
function installSearchButtonListener() {
  $('#js-album-search-button').click(function(event) {
    const [ artist, name ] = $('#js-album-searcher').val().split('|');

    $.ajax({
      url: 'http://localhost:8080/albums',
      dataType: 'json',
      data: {
        artist: artist.trim(),
        name: name.trim()
      },
      success: function(data) {
        data = data[0] || data;
        console.log(data);
        // $('#js-album-header').html(data.artist + ' ' + data.name);
        // $('#js-album-tags').html(data.tags);
        // $('#js-album-rating').html(data.ratings);
        // $('#js-album-comments').html(data.comments);

        $('#js-album-header').html(createAlbumHtml(data));
        $('#js-album-id').val(data._id);
      }
    });
    // unpack album attributes into display
  });
}

// db.albums.find( { artist: 'Lorde' } )

function createAlbumHtml(data) {
  const headerHtml = `artist: ${data.artist} album: ${data.name}`;
  const tagsHtml = `(${data.tags})`;
  const ratingsHtml = `
    ${data.ratings.one} 
    ${data.ratings.two} 
    ${data.ratings.three}
    ${data.ratings.four}
    ${data.ratings.five}<br>
    <input type="button">1</input>
    <input type="button">2</input>
    <input type="button">3</input>
    <input type="button">4</input>
    <input type="button">5</input>
  `;

  const commentsHtml = data.comments.length > 0 ? `comments: ${data.comments[0].username} ${data.comments[0].content}`: 'Comments: ';
  return `${headerHtml} <br>
          ${tagsHtml} <br>
          ${ratingsHtml} <br>
          ${commentsHtml} <br>`;
}

$(function() {
  installSearchButtonListener();
  genreSelector();
  albumSearcher();
});

// Application name	academic
// API key	9cb98547379ad2c1b5b680646cbdac53
// Shared secret	8d5ad4d7da3487a8bf07b5b312ecf66c
// Registered to	krp312