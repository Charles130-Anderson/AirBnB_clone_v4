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
});
