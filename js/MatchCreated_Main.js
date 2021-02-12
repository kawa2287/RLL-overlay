function MatchCreatedMain() {
  //make sure postgame is gone
  $(".postGame .left.team").css({ transform: "translateX(0px)" });
  $(".postGame .right.team").css({ transform: "translateX(0px)" });

  //$(".postGame .left.team").removeClass("left_post_anim");
  //$(".postGame .right.team").removeClass("right_post_anim");

  $("#chart-div").hide();
  console.log("init");

  //Clear player adv stats
  for (let p in playerAdvStats) {
    delete playerAdvStats[p];
  }

  //Clear Variables
  leftShots = [];
  rightShots = [];
  possessionTime = [0, 0];
  ballData = {
    currentOwner: { player: "", team: "" },
    sumSpeed: 0,
    avgSpeed: 0,
    samples: 0,
  };

  //clear current teams
  scheduleLeftTeamName = "";
  scheduleRightTeamName = "";
}
