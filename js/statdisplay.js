function showLowerThird(title) {
  //Set Title
  $("#lowerthird .title").text(title);

  var map = $(".minimap");
  var bPoss = $("#lowerthird");

  //Add class to activate the animation
  map.addClass("map_slide_anim");
  bPoss.addClass("l3animate");

  //remove class  (when the animation is complete)
  setTimeout(function () {
    map.removeClass("map_slide_anim");
    bPoss.removeClass("l3animate");
  }, 30000);
}

function slideStatTile(tilename) {
  //move tile
  $(tilename).addClass("stat_slide_anim");
  //remove class (when the animation is complete)
  setTimeout(function () {
    $(tilename).removeClass("stat_slide_anim");
  }, 30000);
}
