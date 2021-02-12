function HitBall(player) {
  //Check if the player hit the ball

  for (let m in previousData["players"]) {
    if (previousData["players"][m]["name"] === player["name"]) {
      if (player["touches"] > previousData["players"][m]["touches"]) {
        //Current player has hit the ball at this point

        //Determine Player Team
        let tm = previousData["players"][m]["team"];

        //1.  Save Previous Current hit to last hit
        hitData.lastHit.player = hitData.currentHit.player;
        hitData.lastHit.team = hitData.currentHit.team;

        //2.  Save the Current Hit Data
        hitData.currentHit.player = player.name;
        hitData.currentHit.team = tm;
      }
    }
  }
}

function CheckPossession(gTime) {
  // Possession means team has hit the ball twice in a row.
  // Any time after that is considered possession until the other team hits the ball
  if (hitData.currentHit.team === hitData.lastHit.team) {
    if (gTime > 0);
    {
      console.log("im here");
      //This team has possession.  Add 0.1s to posession time
      possessionTime[hitData.currentHit.team] += 0.1;
    }
  }
}
