function ReplayEndMain(d) {
  $("#transitionLogo").removeClass("animate__rollIn");
  $("#transitionLogo").addClass("animate__rollOut");
  $("#transitionBg").removeClass("animate__fadeIn");
  $("#transitionBg").addClass("animate__fadeOut");
  $("#transitionBg").removeClass("hasBg");
  // document.getElementById('hidden-checkbox').click();

  //move player tiles back
  $(".blue.team ").css({ transform: "translateX(0px)" });
  $(".orange.team ").css({ transform: "translateX(0px)" });
  $(".replay ").css({ transform: "translateX(0px)" });
  $(".targetDisplay ").css({ transform: "translateX(0px)" });

  //Hide assister
  $(".replay .box.assist").css({ visibility: "hidden" });
}
