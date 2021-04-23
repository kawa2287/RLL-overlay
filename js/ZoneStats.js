function ZoneStats(player) {
  //check which team player is on
  if (player["team"] === 0) {
    //blue team
    //check which half player is in
    if (player["y"] < 0) {
      //defensive half
      playerAdvStats[player["name"]]["timeDhalf"] += 0.11;
      if (player["y"] < -5110) {
        //in own goal
        playerAdvStats[player["name"]]["timeInDefGoal"] += 0.11;
      }
    } else {
      //offensive half
      playerAdvStats[player["name"]]["timeOhalf"] += 0.11;
      if (player["y"] > 5110) {
        //in opponent goal
        playerAdvStats[player["name"]]["timeInOffGoal"] += 0.11;
      }
    }
  } else {
    //orange team
    //check which half player is in
    if (player["y"] > 0) {
      //defensive half
      playerAdvStats[player["name"]]["timeDhalf"] += 0.11;
      if (player["y"] > 5110) {
        //in own goal
        playerAdvStats[player["name"]]["timeInDefGoal"] += 0.11;
      }
    } else {
      //offensive half
      playerAdvStats[player["name"]]["timeOhalf"] += 0.11;
      if (player["y"] < -110) {
        //in opponent goal
        playerAdvStats[player["name"]]["timeInOffGoal"] += 0.11;
      }
    }
  }
}

function CheckBallZone(ballYpos) {
  if (ballYpos > 0) {
    attackZoneTime[0] += 0.1;
  } else if (ballYpos < 0) {
    attackZoneTime[1] += 0.1;
  }
}
