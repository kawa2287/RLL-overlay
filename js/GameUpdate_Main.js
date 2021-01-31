function GameUpdateMain(d) {
  /*
  |--------------------------------------------------------------------------
  | Main Game Updater
  |--------------------------------------------------------------------------
  |
  | This is the most common subscriber and gets an update ~ every 0.1s
  | This is used to determine players, teams, and stats by pulling form the main data object, d
  | 
  |
  */

  //Set Global Player Teams Array
  globPlayerTmsArr = GetPlayerTeamArray(d);

  // All things related to players and teams
  //--------------------------------------------------------------------------
  //store team info
  let blueTeam = [];
  let orangeTeam = [];
  let allPlayers = [];

  //Get all players in the game
  let players = d["players"];

  //Loop through players obj and assign to team arrays
  for (var key of Object.keys(players)) {
    if (players[key].team === 0) {
      blueTeam.push(players[key]);
    } else {
      orangeTeam.push(players[key]);
    }
    allPlayers.push(players[key]);
  }

  //Determine Team & Logo
  leftTeamName = GetTeam(blueTeam);
  rightTeamName = GetTeam(orangeTeam);

  // All things related to the scoreboard
  //--------------------------------------------------------------------------
  //Clear team Arrays
  teamShots = [0, 0];
  teamScore = [0, 0];
  teamTouches = [0, 0];
  teamBumps = [0, 0];

  //Update scoreboard time
  let gTime = d["game"]["time"];
  $(".scorebug .mid.container .top").text(secondsToMS(gTime));

  //Update Score
  $(".scorebug .left.container .score span").text(
    d["game"]["teams"][0]["score"]
  );
  $(".scorebug .right.container .score span").text(
    d["game"]["teams"][1]["score"]
  );

  //Update ScoreBug League Crest
  let lgID = 1; //Set default
  let lgPath = TEAM_LOGO_MAP["RLL"]; //Set default

  //Check both teams against the TEAM_LEAGUE_MAP to see if they are in the KRLL
  lgID =
    TEAM_LEAGUE_MAP[leftTeamName] === 2 && TEAM_LEAGUE_MAP[rightTeamName] === 2
      ? 2
      : 1;

  //Set Path to proper crest and assign
  lgPath = lgID === 1 ? TEAM_LOGO_MAP["RLL"] : TEAM_LOGO_MAP["KRLL"];
  $(".scorebug .mid .logo img").attr("src", lgPath);

  // All things related to stats
  //--------------------------------------------------------------------------
  //Update Stats
  let isReplay = d["game"]["isReplay"]; // Check if currently in replay mode

  UpdateStats(blueTeam, 0, ".p1", "blue", isReplay, d, gTime);
  UpdateStats(blueTeam, 1, ".p2", "blue", isReplay, d, gTime);
  UpdateStats(blueTeam, 2, ".p3", "blue", isReplay, d, gTime);

  UpdateStats(orangeTeam, 0, ".p1", "orange", isReplay, d, gTime);
  UpdateStats(orangeTeam, 1, ".p2", "orange", isReplay, d, gTime);
  UpdateStats(orangeTeam, 2, ".p3", "orange", isReplay, d, gTime);

  //Update Scorebug
  $(".scorebug .left .team span").text(leftTeamName);
  $(".scorebug .right .team span").text(rightTeamName);
  $(".scorebug .left .logo img").attr("src", TEAM_LOGO_MAP[leftTeamName]);
  $(".scorebug .right .logo img").attr("src", TEAM_LOGO_MAP[rightTeamName]);
  $(".scorebug .mid .shots.left .value").text(teamShots[0]);
  $(".scorebug .mid .shots.right .value").text(teamShots[1]);

  //Show Target Player Stats if focused (the bottom left tile on the screen)
  TargetStats(allPlayers, d);

  //Shot map shots
  //MapShots();

  //Map player positions
  MapPositions(d);

  //Update map pics
  $(".mappics .team.left img").attr("src", TEAM_LOGO_MAP[leftTeamName]);
  $(".mappics .team.right img").attr("src", TEAM_LOGO_MAP[rightTeamName]);

  //Save State
  previousData = d;
}

function GetPlayerTeamArray(d) {
  // This function used to return an array of arrays
  // main array holds the teams
  // next level arrays hold the players

  //Grab all players in game
  let players = d["players"];

  // Create Array to hold players into teams
  let playerTeamArray = []; //[0] = blue, [1] = orange

  //Loop through player objects to determine which team they are assigned to
  for (var key of Object.keys(players)) {
    if (players[key].team === 0) {
      playerTeamArray.push([players[key], "blue"]);
    } else {
      playerTeamArray.push([players[key], "orange"]);
    }
  }
  return playerTeamArray;
}

function UpdateStats(teamArray, indexNum, p, color, isReplay, d, gTime) {
  //This function will update the side stats per player

  //build html locator
  const q = `.${color} ${p}`;
  let tm = color === "blue" ? 0 : 1;

  //Check if player exists.  If not, hide the tile
  if (teamArray[indexNum] !== undefined) {
    $(q).css({ visibility: "visible" });

    // Basic Stats Section
    //--------------------------------------------------------------------------
    //Set Shots
    teamShots[tm] += teamArray[indexNum]["shots"];

    //Set Name
    $(q + " .name").text(teamArray[indexNum]["name"]);

    //Set Points
    let points = teamArray[indexNum]["goals"] + teamArray[indexNum]["assists"];
    $(q + " .points .value").text(points);

    //Set Score
    $(q + " .score .value").text(teamArray[indexNum]["score"]);
    teamScore[tm] += teamArray[indexNum]["score"];

    //Set Logo
    $(q + " .logo img").attr(
      "src",
      TEAM_LOGO_MAP[tm === 0 ? leftTeamName : rightTeamName]
    );

    //Determine Player "Grade"
    let avgScore = AVG_SCORE_MAP[teamArray[indexNum]["name"].toUpperCase()];
    let grade = GetPlayerGrade(teamArray[indexNum]["score"], avgScore, gTime);

    //Set Grade
    $(q + " .performance .value").text(grade["grade"]);
    $(q + " .performance .value").css({ color: grade["color"] });
    $(q + " .performance .title").css({ color: grade["color"] });
    $(q + " .performance").css({ background: grade["background"] });

    // Advanced Stats Section
    //--------------------------------------------------------------------------
    //Check if player exists in the adv stats obj
    if (playerAdvStats[teamArray[indexNum]["name"]] === undefined) {
      //add player to adv stats
      playerAdvStats[teamArray[indexNum]["name"]] = {
        airTime: 0,
        airHits: 0,
        lastHit: {
          x: 0,
          y: 0,
          z: 0,
        },
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        team: "",
        demos: 0,
        demoed: 0,
        timeDhalf: 0,
        timeOhalf: 0,
        scoreDhalf: 0,
        scoreOhalf: 0,
        timeInDefGoal: 0,
        timeInOffGoal: 0,
        ballProx: 0,
        nLMB: 0,
        goalSpeed: 0,
        epicSaves: 0,
        aerialGoals: 0,
        bicycleHits: 0,
        grade: "",
        scoreData: [],
      };
    } else {
      if (previousData !== undefined) {
        //check if game clock is running still
        if (d["game"]["time"] !== previousData["game"]["time"]) {
          //player exists --> add adv stats
          AirStats(teamArray[indexNum]);

          //Check if player hit ball, if yes- save position
          //LastHit(teamArray[indexNum]);

          //Zone stats
          ZoneStats(teamArray[indexNum]);

          //update player scoreData for postgame chart
          let sec = Math.ceil(d["game"]["time"]);
          let prevSec = Math.ceil(previousData["game"]["time"]);

          if (sec % 2 === 0 && sec !== prevSec) {
            let item =
              playerAdvStats[teamArray[indexNum]["name"]]["scoreData"].length;
            playerAdvStats[teamArray[indexNum]["name"]]["scoreData"].push({
              label: item,
              y: teamArray[indexNum]["score"],
            });
          }
        }

        //update player position
        let px = teamArray[indexNum]["x"];
        let py = teamArray[indexNum]["y"];
        let pz = teamArray[indexNum]["z"];

        playerAdvStats[teamArray[indexNum]["name"]]["position"]["x"] = px;
        playerAdvStats[teamArray[indexNum]["name"]]["position"]["y"] = py;
        playerAdvStats[teamArray[indexNum]["name"]]["position"]["z"] = pz;
        playerAdvStats[teamArray[indexNum]["name"]]["team"] =
          color === "blue" ? leftTeamName : rightTeamName;
        playerAdvStats[teamArray[indexNum]["name"]]["grade"] = grade;
      }
    }
  } else {
    $(q).css({ visibility: "hidden" });
  }
}

function progress(percent, $element) {
  $element.css({ width: percent + "%" });
}

function GetTeam(team) {
  // This function used to determine which teams are present in the game
  // based off of the  PLAYER_TEAM_MAP
  // @team = [playerObj, playerObj, ...]

  //Build teams object based off of team logo map
  //This will be used to count how many present players belong to which teams
  let teamsCounter = JSON.parse(JSON.stringify(TEAM_LOGO_MAP));

  //Loop through teams and assign zeroes to all as a starting point
  for (var key of Object.keys(teamsCounter)) {
    teamsCounter[key] = 0;
  }

  /*  TODO - determine team for 2's with a sub
  //loop through players
  /*for (var i = 0; i < team.length; i++) {
    //check if schedule team names are initiated
    if (scheduleLeftTeamName !== "" && scheduleRightTeamName !== "") {
      //filter for current game in schedule
      let tm = PLAYER_TEAM_MAP[team[i]["name"].toUpperCase()];

      console.log(scheduleRightTeamName);
      console.log(scheduleLeftTeamName);

      if (tm === scheduleLeftTeamName || tm === scheduleRightTeamName) {
        teams[PLAYER_TEAM_MAP[team[i]["name"].toUpperCase()]] += 1;
      }
    } else {
      //just do it normally
      teams[PLAYER_TEAM_MAP[team[i]["name"].toUpperCase()]] += 1;
    }
  }*/

  //Loop through the team array and add a count
  for (var i = 0; i < team.length; i++) {
    try {
      //player found to be on a team.  Add a count to that team.
      teamsCounter[PLAYER_TEAM_MAP[team[i]["name"].toUpperCase()]] += 1;
    } catch {
      //player not found to be on a team.  Add a count to the RLL default
      teamsCounter["RLL"] += 1;
    }
  }

  //Push counters to sortable array
  var sortList = [];
  for (var team in teamsCounter) {
    sortList.push([team, teamsCounter[team]]);
  }

  //Sort that Array
  sortList.sort(function (a, b) {
    return b[1] - a[1];
  });

  // return the highest item on that array (ie the one with the most counts...)
  // this should be the team that is playing
  return sortList[0][0];
}

function TargetStats(players, d) {
  //Check if spectator director has player targeted (ie camera is following the player)
  if (d["game"]["hasTarget"]) {
    $(".targetDisplay").css({ visibility: "visible" }); //make targetDisplay Visible in bottom left of screen

    let target = d["game"]["target"]; //Assign the target player

    //Loop through the players array and find the matching target player
    for (let i = 0; i < players.length; i++) {
      if (players[i]["id"] === target) {
        //set stats
        $(".targetDisplay .player .name").text(players[i]["name"]);
        $(".targetDisplay .player .score").text(players[i]["score"]);
        $(".targetDisplay .player .stat.points .value").text(
          players[i]["goals"] + players[i]["assists"]
        );
        $(".targetDisplay .player .stat.goals .value").text(
          players[i]["goals"]
        );
        $(".targetDisplay .player .stat.assists .value").text(
          players[i]["assists"]
        );
        $(".targetDisplay .player .stat.shots .value").text(
          players[i]["shots"]
        );
        $(".targetDisplay .player .stat.saves .value").text(
          players[i]["saves"]
        );
        $(".targetDisplay .player .stat.touches .value").text(
          players[i]["touches"]
        );
        $(".targetDisplay .player .stat.bumps .value").text(
          players[i]["cartouches"]
        );
        $(".targetDisplay .side.speed .middle").text(
          Math.ceil(players[i]["speed"] * 0.621371)
        );
        progress(players[i]["boost"], $(".targetDisplay .player .bar"));

        //set colors and logos
        let team = players[i]["team"];

        //Set Team Goal Icon and Colors
        let teamName = team === 0 ? leftTeamName : rightTeamName;
        let logo = TEAM_LOGO_MAP[teamName];
        let colors = TEAM_COLOR_MAP[teamName];
        let basicColor;
        let barColor;
        if (players[i]["team"] === 0) {
          basicColor = "blue";
          barColor =
            "linear-gradient(to right, blue 0%,blue 50%,rgb(134, 134, 255)  100%)";
        } else {
          basicColor = "rgba(223, 126, 0, 1)";
          barColor =
            "linear-gradient(to right, rgba(223, 126, 0, 1), 0%,rgba(223, 126, 0, 1), 50%,rgb(255, 204, 136) 100%)";
        }

        //apply
        $(".targetDisplay img").attr("src", logo);
        $(".targetDisplay .progressBarCont .bar").css({ background: barColor });

        /*  Use this if we want to see the team's colors rather than just blue or orange
        $(".targetDisplay").css({"background":colors.primary});
        $(".targetDisplay .scoreTitle").css({"color":colors.secondary});
        $(".targetDisplay .side.speed .text").css({"color":colors.secondary});
        $(".targetDisplay .lowerCont").css({"color":colors.secondary});
        $(".targetDisplay .lowerCont").css({"background":colors.shadow});
        $(".targetDisplay .lowerCont .title").css({"background":colors.primary});
        */
        $(".targetDisplay").css({ background: basicColor });
        $(".targetDisplay .scoreTitle").css({ color: "white" });
        $(".targetDisplay .score").css({ color: "yellow" });
        $(".targetDisplay .side.speed .text").css({ color: "white" });
        $(".targetDisplay .side.speed .middle").css({ color: "yellow" });
        $(".targetDisplay .lowerCont").css({ color: "white" });
        $(".targetDisplay .lowerCont").css({ background: "black" });
        $(".targetDisplay .lowerCont .title").css({ background: basicColor });
      }
    }
  } else {
    //hide targetDisplay
    $(".targetDisplay").css({ visibility: "hidden" });
  }
}

function GetPlayerGrade(score, avgScore, gTime) {
  // this is a function to determine the playe's "grade" based off his/her avg score (AVG_SCORE_MAP)
  // the idea is to linearly have a target score the player should be at
  // based on a point in time in the game
  // this assume the game is 300 seconds long (5min)
  let time = gTime === 300 ? 0 : gTime;
  let target = ((300 - time) / 300) * avgScore;
  return GetGrade(target, score);
}

function GetGrade(target, current) {
  //function to help decide the grade of the player and the
  //associated styling to go along with it
  if (current >= target + target * 0.75) {
    return { grade: "AA", background: "yellow", color: "black" };
  } else if (current >= target + target * 0.45) {
    return { grade: "A", background: "#F4D58D", color: "black" };
  } else if (current >= target + target * 0.15) {
    return { grade: "B", background: "#D4C2FC", color: "black" };
  } else if (current >= target - target * 0.15) {
    return { grade: "C", background: "#708D81", color: "white" };
  } else if (current >= target - target * 0.45) {
    return { grade: "D", background: "#BF0603", color: "white" };
  } else if (current >= target - target * 0.75) {
    return { grade: "F", background: "#8D0801", color: "white" };
  } else {
    return { grade: "FF", background: "#001427", color: "white" };
  }
}
