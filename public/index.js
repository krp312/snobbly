'use strict';

function formatRepo (repo) {
  // if (repo.loading) return repo.text;

  var markup = repo.name;

  // if (repo.description) {
  //   markup += '<div class=\'select2-result-repository__description\'>' + repo.description + '</div>';
  // }

  // markup += '<div class=\'select2-result-repository__statistics\'>' +
  //       '<div class=\'select2-result-repository__forks\'><i class=\'fa fa-flash\'></i> ' + repo.forks_count + ' Forks</div>' +
  //       '<div class=\'select2-result-repository__stargazers\'><i class=\'fa fa-star\'></i> ' + repo.stargazers_count + ' Stars</div>' +
  //       '<div class=\'select2-result-repository__watchers\'><i class=\'fa fa-eye\'></i> ' + repo.watchers_count + ' Watchers</div>' +
  //     '</div>' +
  //     '</div></div>';

  return markup;
}

function formatRepoSelection (repo) {
  // return repo.full_name || repo.text;

  return repo.name;
}

function genreSelector() {
  $('.js-genre-selector').select2({
    ajax: {
      url: 'http://localhost:8080/genres',
      dataType: 'json',
      delay: 250,
      data: function(params) {
        return {
          q: params.term, 
        };
      },
      processResults: function (data, params) {
        const namesArr = data.map(function(object, index) {
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
}

$(function() {
  genreSelector();
});