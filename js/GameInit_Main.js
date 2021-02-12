function GameInit(d) {
  //Determine who should be playing next game
  //sheetUpdater.GetNextGame();
  console.log("game init");
  //Clear Variables
  possessionTime = [0, 0];
  ballData = {
    currentOwner: { player: "", team: "" },
    sumSpeed: 0,
    avgSpeed: 0,
    samples: 0,
  };
}
