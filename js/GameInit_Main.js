function GameInit(d) {
  //move pregame away
  $(".pregame ").css({ transform: "translateY(0px)" });

  //make sure postgame is gone
  $(".postGame .left.team").css({ transform: "translateX(0px)" });
  $(".postGame .right.team").css({ transform: "translateX(0px)" });

  console.log("game init");
  sheetUpdater.GetNextGame();

  //Clear Variables
  possessionTime = [0, 0];
  ballData = {
    currentOwner: { player: "", team: "" },
    sumSpeed: 0,
    avgSpeed: 0,
    samples: 0,
  };
}
