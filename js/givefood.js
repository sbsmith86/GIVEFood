var giveFood = (function () {

  function calculateDistance(p1, p2) {
      var erdRadius = 6371;

      p1.lon = p1.lon * (Math.PI / 180);
      p1.lat = p1.lat * (Math.PI / 180);
      p2.lon = p2.lon * (Math.PI / 180);
      p2.lat = p2.lat * (Math.PI / 180);

      var x0 = p1.lon * erdRadius * Math.cos(p1.lat);
      var y0 = p1.lat * erdRadius;

      var x1 = p2.lon * erdRadius * Math.cos(p2.lat);
      var y1 = p2.lat * erdRadius;

      var dx = x0 - x1;
      var dy = y0 - y1;

      return Math.sqrt((dx * dx) + (dy * dy));
  }

  var submitForm = function (zipCode) {
    // Submit AJAX request.
    $.ajax({
      type: "GET",
      url: 'data/schools_list.json',
      data: {
        zip: zipCode,
      },
      dataType: 'json',
    })
    // Handle a successful request.
    .done(function(data) {
      console.log(data);
      // getLocation(zipCode);
      // console.log(userLocation);

      // Get the users location based on the zip code they provided.
      geocoder.geocode({
        'address': zipCode
      }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            // setLocation(results[0].geometry.location);
            var zipLocation = {
              lat: results[0].geometry.location.lat(),
              lon: results[0].geometry.location.lng(),
            }
            console.log("zipLocation");
            console.log(zipLocation);
            // Loop through the JSON data.
            $.each(data.results, function(key, value) {
              console.log(calculateDistance(zipLocation, value));
            });
          } 
          else {
            alert("Geocode was not successful for the following reason: " + status);
          }
      });
    })
    // Handle request errors.
    .fail(function(data) {
      console.log(data);
    });
  };
  
  return {
    submitForm: submitForm,
  };

})();

$(document).ready(function() {
  // Initialize the Google Maps API 
  geocoder = new google.maps.Geocoder();

  // Cache the form.
  var $form = $('.school-form');
  // Submit the form.
  $form.submit(function(e) {
    e.preventDefault();
    // Grab the zip code and pass it to a function that will submit the ajax request.
    var zipCode = $('input[name=zip-code]').val();
    giveFood.submitForm(zipCode);
  });
});