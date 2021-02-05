function showLowerThird() {
  if (mapToggle === 0) {
    mapToggle = 1;
    var map = $(".minimap");

    //Add class to activate the animation
    map.addClass("map_slide_anim");
    //remove class after 10sec (when the animation is complete)
    setTimeout(function () {
      map.removeClass("map_slide_anim");
      mapToggle = 0;
    }, 15000);
  }
}

function showBallPossession() {
  var bPoss = $("#lowerthird");

  if (mapToggle === 0) {
    bPoss.addClass("l3animate");

    //remove class after 10sec (when the animation is complete)
    setTimeout(function () {
      bPoss.removeClass("l3animate");
    }, 15000);

    //Remove Progress bars 2 seconds earlier
    setTimeout(function () {
      $("#comparebars .top .bar").css({ width: "0%", opacity: 0 });
      $("#comparebars .mid .bar").css({ width: "0%", opacity: 0 });
      $("#comparebars .bot .bar").css({ width: "0%", opacity: 0 });
    }, 12000);
  }
}
