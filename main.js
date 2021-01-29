"use strict";

const apiKey = "IptJpzC6QdzZTggB5pgKm6BLb4B8b8mjoHktBJgf";
const apodBaseUrl = "https://api.nasa.gov/planetary/apod";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayApod(responseJson) {
    return $(".apod").html(`<p>Today's date: ${responseJson.date}</p><img src="${responseJson.hdurl}"><p><strong>${responseJson.title}</strong></p><p>${responseJson.explanation}</p>`);
}

function getPicture() {
  const params = {
    api_key: apiKey,
    concept_tags: true
  };
  const queryString = formatQueryParams(params);
  const url = apodBaseUrl + "?" + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayApod(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getSearchResults();
  });
}

$(getPicture);

$(watchForm);
