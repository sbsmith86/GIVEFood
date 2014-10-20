var giveFood = (function () {

  var init = function () {
    $('.main-background-image').css('background-color','magenta');

    $.post( "data/schools_list.json", function( data ) {
      console.log(data);
    });
  };
  
  return {
    init: init,
  };

})();