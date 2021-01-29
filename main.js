"use strict";

const apiKey = "IptJpzC6QdzZTggB5pgKm6BLb4B8b8mjoHktBJgf";
const searchURL = "https://api.nasa.gov/planetary/apod";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $("#results-list").empty();
    for (let i = 0; i < responseJson.data.length; i++) {
        $("#results-list").append(
          `<li><h3>${responseJson.data[i].fullName}</h3>
            <p>${responseJson.data[i].description}</p>
            <p>Learn more: <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></p>
            </li><hr>`
        );
      }
  //display the results section
  $("#results").removeClass("hidden");
}

function getParks(query, maxResults) {
  const params = {
    api_key: apiKey,
    q: query,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getParks(searchTerm, maxResults);
  });
}

$(watchForm);