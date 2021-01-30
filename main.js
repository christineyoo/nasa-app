const apiKey = "IptJpzC6QdzZTggB5pgKm6BLb4B8b8mjoHktBJgf";
const apodBaseUrl = "https://api.nasa.gov/planetary/apod";
const libraryBaseUrl = "https://images-api.nasa.gov/search";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayPicture(responseJson) {
  return $(".apod").html(
    `<p>Today's date: ${responseJson.date}</p><img src="${responseJson.hdurl}"><p><strong>${responseJson.title}</strong></p><p>${responseJson.explanation}</p>`
  );
}

function displaySearchResults(responseJson) {
  $("#results").append(`<p>${responseJson.collection.items[0].data[0].title}<p><img src="${responseJson.collection.items[0].links[0].href}"><p>${responseJson.collection.items[0].data[0].description_508}<p><p>Date created:${responseJson.collection.items[0].data[0].date_created}<p>`);

  $("#results").removeClass("hidden");
}

function getPicture() {
  const params = {
    api_key: apiKey
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
    .then((responseJson) => displayPicture(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getSearchResults(query) {
  const params = {
    q: query,
  };

  const queryString = formatQueryParams(params);
  const libraryUrl = libraryBaseUrl + "?" + queryString;

  console.log(libraryUrl);

  const options = {
    method: 'GET'
  };

  fetch(libraryUrl, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displaySearchResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    // const maxResults = $("$js-max-results").val();
    getSearchResults(searchTerm);
  });
}

$(getPicture);

$(watchForm);

// GET method failed. Try including a method object in the call. Also read the documentation (page 2);
