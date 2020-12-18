function MatchCreatedMain() {
  //make sure postgame is gone
  $(".postGame .left.team").css({ transform: "translateX(0px)" });
  $(".postGame .right.team").css({ transform: "translateX(0px)" });
  $("#chart-div").hide();

  //Show tournament page
  $(".tournament").css({ transform: "translateY(-1080px)" });
  //read from google sheets
  sheetUpdater.sheetUpdater("fake", 0, "fake", 0, false);

  //Clear player adv stats
  for (let p in playerAdvStats) {
    delete playerAdvStats[p];
  }

  //Clear Shots
  leftShots = [];
  rightShots = [];
}
