function PostGameMain(d) {
  //show post game scores
  //$(".postGame .left.team").addClass("left_post_anim");
  //$(".postGame .right.team").addClass("right_post_anim");

  $(".postGame .left.team").css({ transform: "translateX(960px)" });
  $(".postGame .right.team").css({ transform: "translateX(-960px)" });
  $("#chart-div").show();

  //Create export array
  let exportContent = [];
  let headers = [
    "PLAYER",
    "TM",
    "OPP",
    "GP",
    "TM SC",
    "OPP SC",
    "SCORE",
    "G",
    "A",
    "SV",
    "SH",
    "MVP",
    "PTS",
    "W",
    "L",
    "TM TOT SC",
    "TM AVG SCORE",
    "TM%",
    "RATING",
    "TYPE",
    "TOUCHES",
    "BUMPS",
    "AIR TIME",
    "AIR HITS",
  ];

  //Get Max Stats
  let maxStats = {
    score: 0,
    goals: 0,
    assists: 0,
    shots: 0,
    saves: 0,
    points: 0,
    touches: 0,
    cartouches: 0,
    airTime: 0,
    airHits: 0,
  };

  //Fill Max Stats
  GetMaxStats(maxStats);

  //Sort Players Array
  //push to sorting array
  let sortList = [];
  for (var p in globPlayerTmsArr) {
    sortList.push([globPlayerTmsArr[p][0], globPlayerTmsArr[p][0]["score"]]);
  }

  //sort
  sortList.sort(function (a, b) {
    return b[1] - a[1];
  });

  //Colors to be used on chart
  const chartColors = [
    ["#0000FF", "#4747FF", "#8585FF"],
    ["#F59F00", "#FFB01F", "#FFBF47"],
  ];

  //fill Chart
  let chartData = [];
  let header = ["time"];
  let snapShots = 0;

  //Fill out stats
  for (let n = 0; n <= 1; n++) {
    //set side
    let side = n === 0 ? ".left.team" : ".right.team";

    //set score
    $(".postGame " + side + " .tmscore").text(
      previousData["game"]["teams"][n]["score"]
    );

    //hide players for 2's
    if (sortList.length === 4) {
      let quer = "postGame " + side + " .postDisplay" + ".p3";
      console.log(quer);
      $(quer).css({
        visibility: "hidden",
      });
    }

    let counter = 0;
    for (let i = 0; i < sortList.length; i++) {
      let x = sortList[i][0];

      if (x["team"] === n) {
        //set player
        counter += 1;
        let t = ".p" + counter;

        //set search
        let q = ".postGame " + side + " .postDisplay" + t;

        let aTime = playerAdvStats[x["name"]]["airTime"];

        //set stats
        $(q + " .player .stat.touches .title").text("BALL TOUCHES");
        $(q + " .player .stat.touches .title").css({ "font-size": "10px" });
        $(q + " .player .stat.bumps .title").text("CAR BUMPS");
        $(q + " .player .stat.bumps .title").css({ "font-size": "10px" });
        $(q + " .player .stat.airTime .title").text("AIR TIME");
        $(q + " .player .stat.airTime .title").css({ "font-size": "10px" });
        $(q + " .player .stat.airTime .value").css({ "text-transform": "" });
        $(q + " .player .stat.airHits .title").text("AIR HITS");
        $(q + " .player .stat.airHits .title").css({ "font-size": "10px" });

        let pts = x["goals"] + x["assists"];
        $(q + " .player .name").text(x["name"]);
        $(q + " .player .score").text(x["score"]);
        $(q + " .player .grade").text(
          playerAdvStats[x["name"]]["grade"]["grade"]
        );
        $(q + " .player .grade").css({
          background: playerAdvStats[x["name"]]["grade"]["background"],
        });
        $(q + " .player .grade").css({
          color: playerAdvStats[x["name"]]["grade"]["color"],
        });
        $(q + " .player .stat.points .value").text(pts);
        $(q + " .player .stat.goals .value").text(x["goals"]);
        $(q + " .player .stat.assists .value").text(x["assists"]);
        $(q + " .player .stat.shots .value").text(x["shots"]);
        $(q + " .player .stat.saves .value").text(x["saves"]);
        $(q + " .player .stat.touches .value").text(x["touches"]);
        $(q + " .player .stat.bumps .value").text(x["cartouches"]);
        $(q + " .player .stat.airTime .value").text(aTime.toFixed(1) + "s");
        $(q + " .player .stat.airHits .value").text(
          playerAdvStats[x["name"]]["airHits"]
        );

        //Add player name to chart header
        header.push(x["name"]);

        //set colors and logos
        let team = x["team"];

        //Set Team Goal Icon and Colors
        let teamName = team === 0 ? leftTeamName : rightTeamName;
        let logo = TEAM_LOGO_MAP[teamName];
        let colors = TEAM_COLOR_MAP[teamName];

        //apply
        $(".postGame " + side + " .upperArea img").attr("src", logo);
        $(".postGame " + side).css({
          "background-image":
            "linear-gradient(to top,grey , " + colors.primary + ")",
        });

        $(q + " img").attr("src", logo);
        $(q).css({ background: colors.primary });
        $(q + " .scoreTitle").css({ color: "white" });
        $(q + " .lowerCont").css({ color: "white" });
        $(q + " .lowerCont").css({ background: "black" });
        $(q + " .lowerCont .title").css({
          background: colors.primary,
        });

        //check and apply if stat leader
        SetStatGlow(x["score"], "score", "score", q, maxStats);
        SetStatGlow(pts, "points", "points", q, maxStats);
        SetStatGlow(x["goals"], "goals", "goals", q, maxStats);
        SetStatGlow(x["assists"], "assists", "assists", q, maxStats);
        SetStatGlow(x["shots"], "shots", "shots", q, maxStats);
        SetStatGlow(x["saves"], "saves", "saves", q, maxStats);
        SetStatGlow(x["touches"], "touches", "touches", q, maxStats);
        SetStatGlow(x["cartouches"], "cartouches", "bumps", q, maxStats);
        SetStatGlow(x["airTime"], "airTime", "airTime", q, maxStats);
        SetStatGlow(x["airHits"], "airHits", "airHits", q, maxStats);
      }
    }
  }

  //Push header into chartData
  chartData.push(header);

  //Determine maxSnapshots
  for (const player in playerAdvStats) {
    //Determine how many snapshots
    let snapLength = playerAdvStats[player]["scoreData"].length;
    if (snapLength > snapShots) {
      snapShots = snapLength;
    }
  }

  //Fill Each Snapshot
  for (var i = 0; i < snapShots; i++) {
    let snapShot = [];
    snapShot.push(i);

    for (const player in playerAdvStats) {
      for (var p = 0; p < Object.keys(playerAdvStats).length; p++) {
        //check to make sure it is correct player
        if (player === header[p + 1]) {
          snapShot.push(playerAdvStats[player]["scoreData"][i]["y"]);
          break;
        }
      }
    }
    chartData.push(snapShot);
  }

  //Draw Chart
  //google.charts.setOnLoadCallback(drawChart(chartData, chartColors));

  //Write score to sheets
  //sheet variables
  let team0name = leftTeamName;
  let team1name = rightTeamName;
  let team0score = previousData["game"]["teams"][0]["score"];
  let team1score = previousData["game"]["teams"][1]["score"];

  sheetUpdater.sheetUpdater(team0name, team0score, team1name, team1score, true);

  //clear current teams
  //scheduleLeftTeamName;
  //scheduleRightTeamName;
}

function SetStatGlow(pStat, stat, divClass, q, maxStats) {
  if (stat === "score") {
    if (pStat === maxStats[stat] && maxStats[stat] !== 0) {
      $(q + " .player .score").css({ color: "yellow" });
      $(q + " .player .score").css({ "text-shadow": "1px 1px 1px black" });
    } else {
      $(q + " .player .score").css({ color: "white" });
      $(q + " .player .score").css({ "text-shadow": "" });
    }
  } else {
    if (pStat === maxStats[stat] && maxStats[stat] !== 0) {
      //$(q +" .player .stat."+divClass+" .value").css({"animation":"statGlow 3s ease infinte"});
      $(q + " .player .stat." + divClass + " .value").css({ color: "yellow" });
      $(q + " .player .stat." + divClass + " .value").css({
        "text-shadow": "1px 1px 1px black",
      });
    } else {
      //$(q +" .player .stat."+divClass+" .value").css({"animation":""});
      $(q + " .player .stat." + divClass + " .value").css({ color: "black" });
      $(q + " .player .stat." + divClass + " .value").css({
        "text-shadow": "",
      });
    }
  }
}

function GetMaxStats(maxStats) {
  for (let p in globPlayerTmsArr) {
    let source = globPlayerTmsArr[p][0];

    CheckStat(maxStats, source, "score");
    CheckStat(maxStats, source, "goals");
    CheckStat(maxStats, source, "assists");
    CheckStat(maxStats, source, "shots");
    CheckStat(maxStats, source, "saves");
    CheckStat(maxStats, source, "touches");
    CheckStat(maxStats, source, "cartouches");

    CheckStat(maxStats, source, "points");
    CheckStat(maxStats, source, "airTime");
    CheckStat(maxStats, source, "airHits");
  }
}

function CheckStat(maxStats, source, stat) {
  if (stat === "points") {
    let points = source["goals"] + source["assists"];
    if (points > maxStats["points"]) {
      maxStats["points"] = points;
    }
  } else if (stat === "airTime") {
    let airTime = playerAdvStats[source["name"]];
    if (airTime > maxStats["airTIme"]) {
      maxStats["airTime"] = airTime;
    }
  } else if (stat === "airHits") {
    let airHits = playerAdvStats[source["name"]];
    if (airHits > maxStats["airHits"]) {
      maxStats["airHits"] = airHits;
    }
  } else {
    if (source[stat] > maxStats[stat]) {
      maxStats[stat] = source[stat];
    }
  }
}

function ExportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
}
