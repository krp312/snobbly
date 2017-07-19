var stateObject = {
  pageTitle: 'hello world',
  repos: []
}

var GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories';


// html template of a github result
var RESULT_HTML_TEMPLATE = (
  '<div>' +
    '<h2>' +
    '<a class="js-result-name" href="" target="_blank"></a> by <a class="js-user-name" href="" target="_blank"></a></h2>' +
    '<p>Number of watchers: <span class="js-watchers-count"></span></p>' + 
    '<p>Number of open issues: <span class="js-issues-count"></span></p>' +
  '</div>'
);

// fetches api data, updates state object
function getDataFromApi(searchTerm, callback) {
  var settings = {
    url: GITHUB_SEARCH_URL,
    data: {
      q: searchTerm + " in:name",
      per_page: 5
    },
    dataType: 'json',
    type: 'GET'
  };
  $.ajax(settings)
    .then(data => {
      stateObject.repos = data;
      callback();
    });
}

// updates the DOM
// result is a github object with several properties
// .text either sets the value of the matched html elements
// .attr in this case sets the attribute values of the elements
function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-result-name").text(result.name).attr("href", result.html_url);
  template.find(".js-user-name").text(result.owner.login).attr("href", result.owner.html_url);
  template.find(".js-watchers-count").text(result.watchers_count);
  template.find(".js-issues-count").text(result.open_issues);
  
  return template;
}

// updates the dom with the current state object
function displayGitHubSearchData() {
  var results = stateObject.repos.items.map(function(item, index) {
    return renderResult(item);
  });
  $('.js-search-results').html(results);
}

// starts everything
function watchSubmit() {
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    var queryTarget = $(event.currentTarget).find('.js-query');
    var query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayGitHubSearchData);
  });
}

$(watchSubmit);