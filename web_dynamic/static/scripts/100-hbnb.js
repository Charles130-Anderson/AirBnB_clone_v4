$(document).ready(function () {
  const locationsHeading4 = $("div.locations h4");
  const states = $("div.locations .popover ul input[type='checkbox'][data-name]:first-child");
  const cities = $("div.locations .popover ul input[type='checkbox'][data-name]:not(:first-child)");

  const statesDict = {};
  const citiesDict = {};

  // Listen to changes on each input checkbox tag
  states.on("change", function () {
    const dataId = $(this).data("id");
    const dataName = $(this).data("name");

    // If the checkbox is checked, store the State ID in the variable
    if ($(this).is(":checked")) {
      statesDict[dataId] = dataName;
    }
    // If the checkbox is unchecked, remove the State ID from the variable
    else {
      delete statesDict[dataId];
    }

    // Update the h4 tag inside the div Locations with the list of States checked
    locationsHeading4.text(Object.values(statesDict).join(", "));
  });

  cities.on("change", function () {
    const dataId = $(this).data("id");
    const dataName = $(this).data("name");

    // If the checkbox is checked, store the City ID in the variable
    if ($(this).is(":checked")) {
      citiesDict[dataId] = dataName;
    }
    // If the checkbox is unchecked, remove the City ID from the variable
    else {
      delete citiesDict[dataId];
    }

    // Update the h4 tag inside the div Locations with the list of Cities checked
    locationsHeading4.text(Object.values(citiesDict).join(", "));
  });

  // Request API status
  $.get("http://0.0.0.0:5001/api/v1/status/", function (data, status) {
    if (status === "success" && data.status === "OK") {
      // Add the class available to the div#api_status
      $("#api_status").addClass("available");
    } else {
      // Remove the class available to the div#api_status
      $("#api_status").removeClass("available");
    }
  });

  // When the button tag is clicked
  $("button").click(function () {
    // Send a new POST request to places_search with the list of Amenities, Cities and States checked
    $.ajax({
      type: "POST",
      url: "http://0.0.0.0:5001/api/v1/places_search/",
      contentType: "application/json",
      data: JSON.stringify({
        amenities: Object.keys(amenitiesDict),
        states: Object.keys(statesDict),
        cities: Object.keys(citiesDict)
      }),
      success: function (data) {
        // Loop into the result of the request and create an article tag representing a Place
        $("section.places").empty();
        for (const place of data) {
          const article = $("<article></article>");
          const titleBox = $("<div class='title_box'></div>");
          const title = $("<h2></h2>").text(place.name);
          const priceByNight = $("<div class='price_by_night'></div>").text("$" + place.price_by_night);
          const information = $("<div class='information'></div>");
          const maxGuest = $("<div class='max_guest'></div>").text(place.max_guest + " Guest" + (place.max_guest !== 1 ? "s" : ""));
          const numberRooms = $("<div class='number_rooms'></div>").text(place.number_rooms + " Bedroom" + (place.number_rooms !== 1 ? "s" : ""));
          const numberBathrooms = $("<div class='number_bathrooms'></div>").text(place.number_bathrooms + " Bathroom" + (place.number_bathrooms !== 1 ? "s" : ""));
          const user = $("<div class='user'></div>").text("Owner: " + place.user.first_name + " " + place.user.last_name);
          const description = $("<div class='description'></div>").text(place.description);

          titleBox.append(title, priceByNight);
          information.append(maxGuest, numberRooms, numberBathrooms);
          article.append(titleBox, information, user, description);
          $("section.places").append(article);
        }
      }
    });
  });
});
