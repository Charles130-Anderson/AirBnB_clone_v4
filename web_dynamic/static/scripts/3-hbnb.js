$(document).ready(function () {
  const amenitiesHeading4 = $("div.amenities h4");
  const amenities = $("div.amenities .popover ul input:checkbox");
  const amenitiesDict = {};

  // Listen for changes on each input checkbox tag
  amenities.on("change", function () {
    const dataId = $(this).data("id");
    const dataName = $(this).data("name");

    // If the checkbox is checked, store the Amenity ID in the variable
    if ($(this).is(":checked")) {
      amenitiesDict[dataId] = dataName;
    } 
    // If the checkbox is unchecked, remove the Amenity ID from the variable
    else {
      delete amenitiesDict[dataId];
    }

    // Update the h4 tag inside the div Amenities with the list of Amenities checked
    amenitiesHeading4.text(Object.values(amenitiesDict).join(", "));
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

  // Request places data from API
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: "http://0.0.0.0:5001/api/v1/places_search/",
    data: JSON.stringify({}),
    dataType: "json",
    success: function (data) {
      // Loop through the result of the request and create an article tag representing a Place
      const placesSection = $("section.places");
      data.forEach(function (place) {
        const article = $("<article></article>");
        const titleBox = $("<div class='title_box'></div>");
        const title = $("<h2></h2>").text(place.name);
        const priceByNight = $("<div class='price_by_night'></div>").text("$" + place.price_by_night);
        const information = $("<div class='information'></div>");
        const maxGuest = $("<div class='max_guest'></div>").text(place.max_guest + " Guest" + (place.max_guest !== 1 ? "s" : ""));
        const numberRooms = $("<div class='number_rooms'></div>").text(place.number_rooms + " Bedroom" + (place.number_rooms !== 1 ? "s" : ""));
        const numberBathrooms = $("<div class='number_bathrooms'></div>").text(place.number_bathrooms + " Bathroom" + (place.number_bathrooms !== 1 ? "s" : ""));
        const user = $("<div class='user'></div>").text("Owner: " + place.user.first_name + " " + place.user.last_name);
        const description = $("<div class='description'></div>").html(place.description);
        
        titleBox.append(title, priceByNight);
        information.append(maxGuest, numberRooms, numberBathrooms);
        article.append(titleBox, information, user, description);
        placesSection.append(article);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error occurred while fetching places data:", error);
    }
  });
});
