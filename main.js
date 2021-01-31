// API key and base URLs
const apiKey = "IptJpzC6QdzZTggB5pgKm6BLb4B8b8mjoHktBJgf";
const apodBaseUrl = "https://api.nasa.gov/planetary/apod";
const libraryBaseUrl = "https://images-api.nasa.gov/search";

// This function formats the query parameters into a string
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

// displayPicture is responsible for displaying the picture of the day
function displayPicture(responseJson) {
  return $(".apod").html(
    `<h1 id="top">Astronomy Picture of the Day <br> ${responseJson.date}</h1><img src="${responseJson.hdurl}" alt="Astronomy picture of the day"><h3>${responseJson.title}</h3><p>${responseJson.explanation}</p>`
  );
}

// displaySearchResults is responsible for displaying the search results
function displaySearchResults(responseJson, quantity) {
  $("#results-list").empty();
  $("#js-error-message").empty();

  // for loop displays the number of results based on the user's quantity input
  for (let i = 0; i < quantity; i++) {
    $("#results-list")
      .append(`<li><h4>${responseJson.collection.items[i].data[0].title}</h4>
    <img src="${responseJson.collection.items[i].links[0].href}" alt="Image of searched term${i}">
    <p>${responseJson.collection.items[i].data[0].description}</p>
    <p>Date created: ${responseJson.collection.items[i].data[0].date_created}</p></li><hr>`);
  }
  // Removes the hidden class to show the results
  $("#results").removeClass("hidden");
}

// getPicture and getSearchResults are responsible for fetching API data
function getPicture() {
  const params = {
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = apodBaseUrl + "?" + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayPicture(responseJson))
    .catch((err) => {
      $("#js-error-message").text(
        `Something went wrong: ${err.message}`
      );
    });
}

function getSearchResults(query, quantity) {
  const params = {
    q: query,
  };
  const queryString = formatQueryParams(params);
  const libraryUrl = libraryBaseUrl + "?" + queryString;
  const options = {
    method: "GET",
  };

  fetch(libraryUrl, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displaySearchResults(responseJson, quantity))
    .catch((err) => {
      $("#js-error-message").text("Something went wrong. Try searching a new term.");
    });
}


// watchForm is responsible for listening for the submit event
function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getSearchResults(searchTerm, maxResults);
  });
}

$(getPicture);
$(watchForm);
