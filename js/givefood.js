var giveFood = (function () {
  // Implements the Haversine formula to calculate the distance between two points.
  function calculateDistance(p1, p2) {
      var erdRadius = 6371;

      var 
      p1Lon = p1.lon * (Math.PI / 180),
      p1Lat = p1.lat * (Math.PI / 180),
      p2Lon = p2.lon * (Math.PI / 180),
      p2Lat = p2.lat * (Math.PI / 180);

      var x0 = p1Lon * erdRadius * Math.cos(p1Lat);
      var y0 = p1Lat * erdRadius;

      var x1 = p2Lon * erdRadius * Math.cos(p2Lat);
      var y1 = p2Lat * erdRadius;

      var dx = x0 - x1;
      var dy = y0 - y1;
      return Math.sqrt((dx * dx) + (dy * dy));
  }

  var submitForm = function (zipCode) {
    var $msgs = $('.success-message');
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
      // Get the users location based on the zip code they provided.
      geocoder.geocode({
        'address': zipCode
      }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            var 
            // Store long and lat in an object.
            zipLocation = {
              lat: results[0].geometry.location.lat(),
              lon: results[0].geometry.location.lng(),
            },
            threshold = 60,
            finalResults = [];

            // Loop through the school data and calculate the distance between the
            // zip code provided and each school on the list.
            $.each(data.results, function(key, value) {
              // Calculate the distance.
              distance = calculateDistance(zipLocation, value);
              // Store the distance as a property of the result object.
              value['distance'] = distance;
              // Add it to an array.
              finalResults.push(value);
              // Sort the array in ascending order.
              finalResults.sort(function(a, b) {
                return a.distance - b.distance;
              });            
            });

            // Create a success message.
            var successMessage = '<h4>Sweet! We found some places close by you can give to:</h4>';
            
            // Loop through the top three results and add them to the page.
            for ( var i = 0; i < 3; i++ ) {
              var $resultContainer = $('.school-result-' + i);
              $resultContainer.find('.school-name').html(finalResults[i].name);
              $resultContainer.find('.school-street').html(finalResults[i].street);
              $resultContainer.find('.school-city-state').html(finalResults[i].city + ', ' + finalResults[i].state + ', ' + finalResults[i].zip);
              $resultContainer.find('.school-distance').html(Math.floor(finalResults[i].distance) + ' miles away');

              // Check the distances on the results, if it is too far, then let the user know we couldn't find anything closer.
              if (finalResults[i].distance >= threshold) {
                successMessage = "<h4>There isn't a school near by but you can travel to any of these:</h4>"; 
              }
            }

            // Add the success message to the page.
            $msgs.html(successMessage);
          } 
          else {
            $msgs.html('<h4>Oh no! We had an issue finding your results. Please try again later.</h4>');
          }
      });
    })
    // Handle request errors.
    .fail(function(data) {
      $msgs.html('<h4>Oh no! We had an issue finding your results. Please try again later.</h4>');
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