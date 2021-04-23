//require("dotenv").config();

function GetStats(teamA, teamB) {
  const { GoogleSpreadsheet } = require("google-spreadsheet");
  const GOOGLE_SERVICE_ACCOUNT_EMAIL = ENV_MAP["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
  const GOOGLE_PRIVATE_KEY = ENV_MAP["GOOGLE_PRIVATE_KEY"];
  const GOOGLE_SHEETS_SHEET_ID = ENV_MAP["GOOGLE_SHEETS_SHEET_ID"];
  const ROOM_NAME = ENV_MAP["ROOM_NAME"];

  const privateKey = GOOGLE_PRIVATE_KEY;
  const sheetId = GOOGLE_SHEETS_SHEET_ID;
  const email = GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!ROOM_NAME) {
    // spreadsheet key is the long id in the sheets URL
    console.log("no ROOM_NAME env var set");
    return -1;
  }

  let stats = [];
  let lgStats = {};

  //try connection to sheet and determine next game of host room
  try {
    const doc = new GoogleSpreadsheet(sheetId);
    doc
      .useServiceAccountAuth({
        client_email: email,
        private_key: privateKey.replace(/\\n/g, "\n"),
      })
      .then(() => {
        doc.loadInfo().then(async () => {
          //Get Schedule
          const sheet = doc.sheetsByTitle["pregame"];

          //Get Team Stats
          sheet.getRows().then((rows) => {
            // find team
            const len = rows.length;

            // loop through rows
            for (let x = 0; x < len; x++) {
              let cur = rows[x];

              //check if team name matches

              if (
                cur["TM"] === teamA ||
                cur["TM"] === teamB ||
                cur["TM"] === "LEAGUE MAX"
              ) {
                //set stats
                if (cur["TM"] === teamA || cur["TM"] === teamB) {
                  //set team stats
                  let side = cur["TM"] === teamA ? ".left" : ".right";
                  let colors = TEAM_COLOR_MAP[cur["TM"]];
                  stats.push({
                    name: cur["TM"],
                    score: cur["AVG SCORE"],
                    goals: cur["AVG GOALS"],
                    saves: cur["AVG SAVES"],
                    shots: cur["AVG SHOTS"],
                    touches: cur["AVG TOUCHES"],
                    airhit: cur["AVG AIR HITS"],
                    demos: cur["AVG DEMOS"],
                    useful: cur["AVG USEFUL HITS"],
                    side: side,
                    colors: colors,
                  });
                } else {
                  //set league maxes
                  lgStats = {
                    name: cur["TM"],
                    score: cur["AVG SCORE"],
                    goals: cur["AVG GOALS"],
                    saves: cur["AVG SAVES"],
                    shots: cur["AVG SHOTS"],
                    touches: cur["AVG TOUCHES"],
                    airhit: cur["AVG AIR HITS"],
                    demos: cur["AVG DEMOS"],
                    useful: cur["AVG USEFUL HITS"],
                  };
                }
              }
            }
            //set stats
            for (var i = 0; i < 2; i++) {
              //stats
              UpdateStat(stats, lgStats, "score", i);
              UpdateStat(stats, lgStats, "goals", i);
              UpdateStat(stats, lgStats, "saves", i);
              UpdateStat(stats, lgStats, "shots", i);
              UpdateStat(stats, lgStats, "airhit", i);
              UpdateStat(stats, lgStats, "demos", i);
              UpdateStat(stats, lgStats, "useful", i);
              UpdateStat(stats, lgStats, "chance", i);
            }
            console.log("stat set");
          });
        });
      });
  } catch (e) {
    console.error("Error updating google sheet", e);
    return -1;
  }
}

function UpdateStat(stats, lgStats, stat, i) {
  //determine side
  let side = stats[i].side;

  //determine tm
  let tm = i === 0 ? 0 : 1;
  let opp = i === 0 ? 1 : 0;

  //determine if win chance toggle
  let wChance = stat === "chance" ? true : false;
  let val = 0;
  let w = 0;
  let visibility;

  if (wChance) {
    val =
      (
        (100 * parseFloat(stats[tm]["score"])) /
        (parseFloat(stats[tm]["score"]) + parseFloat(stats[opp]["score"]))
      ).toFixed(1) + "%";
    w = val;
    visibility =
      stats[tm]["score"] > stats[opp]["score"] ? "visible" : "hidden";
  } else {
    val = stats[tm][stat];
    let tot = parseFloat(lgStats[stat]);
    w = ((100 * stats[tm][stat]) / tot).toFixed(2) + "%";
    visibility = stats[tm][stat] > stats[opp][stat] ? "visible" : "hidden";
  }

  //update value
  $(".preGame .preview .charts .item." + stat + " .value" + side).text(val);

  //update bar width and color
  $(".preGame .preview .charts .item." + stat + " .cont" + side + " .bar").css({
    width: w,
    background: stats[i].colors.primary,
  });

  //check if stat greater than opponent
  $(".preGame .preview .charts .item." + stat + " .favor" + side + " .fas").css(
    {
      visibility: visibility,
    }
  );
}

exports.GetStandings = function () {
  const { GoogleSpreadsheet } = require("google-spreadsheet");
  const GOOGLE_SERVICE_ACCOUNT_EMAIL = ENV_MAP["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
  const GOOGLE_PRIVATE_KEY = ENV_MAP["GOOGLE_PRIVATE_KEY"];
  const GOOGLE_SHEETS_SHEET_ID = ENV_MAP["GOOGLE_SHEETS_SHEET_ID"];
  const ROOM_NAME = ENV_MAP["ROOM_NAME"];

  const privateKey = GOOGLE_PRIVATE_KEY;
  const sheetId = GOOGLE_SHEETS_SHEET_ID;
  const email = GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!ROOM_NAME) {
    // spreadsheet key is the long id in the sheets URL
    console.log("no ROOM_NAME env var set");
    return -1;
  }

  //try connection to sheet and determine next game of host room
  try {
    const doc = new GoogleSpreadsheet(sheetId);
    doc
      .useServiceAccountAuth({
        client_email: email,
        private_key: privateKey.replace(/\\n/g, "\n"),
      })
      .then(() => {
        doc.loadInfo().then(async () => {
          //Get Schedule
          const sh = doc.sheetsByTitle["Divisions"];

          sh.loadCells("A1:BB14").then(() => {
            //start populating standings

            for (let i = 1; i <= 8; i++) {
              //logo
              let logo = TEAM_LOGO_MAP[sh.getCellByA1("AU" + (i + 4)).value];
              $(".preGame .standings .teams .t." + i + " .logo img").attr(
                "src",
                logo
              );

              //Dong
              $(".preGame .standings .teams .t." + i + " .dong").text(
                sh.getCellByA1("AV" + (i + 4)).value
              );

              //Match Wins
              $(".preGame .standings .teams .t." + i + " .matchwins").text(
                sh.getCellByA1("AW" + (i + 4)).value
              );

              //wins
              $(".preGame .standings .teams .t." + i + " .w.record").text(
                sh.getCellByA1("AX" + (i + 4)).value
              );

              //losses
              $(".preGame .standings .teams .t." + i + " .l.record").text(
                sh.getCellByA1("AY" + (i + 4)).value
              );

              //+/-
              $(".preGame .standings .teams .t." + i + " .diff.val").text(
                sh.getCellByA1("AZ" + (i + 4)).value
              );

              //GF
              $(".preGame .standings .teams .t." + i + " .gf.val").text(
                sh.getCellByA1("BA" + (i + 4)).value
              );
            }
          });
        });
      });
  } catch (e) {
    console.error("Error updating google sheet", e);
    return -1;
  }
};

exports.GetNextGame = function () {
  const { GoogleSpreadsheet } = require("google-spreadsheet");
  const GOOGLE_SERVICE_ACCOUNT_EMAIL = ENV_MAP["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
  const GOOGLE_PRIVATE_KEY = ENV_MAP["GOOGLE_PRIVATE_KEY"];
  const GOOGLE_SHEETS_SHEET_ID = ENV_MAP["GOOGLE_SHEETS_SHEET_ID"];
  const ROOM_NAME = ENV_MAP["ROOM_NAME"];

  const privateKey = GOOGLE_PRIVATE_KEY;
  const sheetId = GOOGLE_SHEETS_SHEET_ID;
  const email = GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!ROOM_NAME) {
    // spreadsheet key is the long id in the sheets URL
    console.log("no ROOM_NAME env var set");
    return -1;
  }

  //try connection to sheet and determine next game of host room
  try {
    const doc = new GoogleSpreadsheet(sheetId);
    doc
      .useServiceAccountAuth({
        client_email: email,
        private_key: privateKey.replace(/\\n/g, "\n"),
      })
      .then(() => {
        doc.loadInfo().then(async () => {
          //Get Schedule
          const sheet = doc.sheetsByTitle["ScheduleRows"];

          sheet.getRows().then((rows) => {
            // get the next un-recorded row
            const len = rows.length;

            for (let x = 0; x < len; x++) {
              let cur = rows[x];

              //check if team names are undefined
              if (cur["TM_A"] === "" || cur["TM_B"] === "") {
                //skip
                continue;
              }

              console.log(cur);

              //check if team names are in place, but there is no score yet
              if (
                cur["TM_A"] !== "" &&
                cur["TM_B"] !== "" &&
                cur["TM_A_SCR"] === "" &&
                cur["TM_B_SCR"] === "" &&
                cur["ROOM"] === ROOM_NAME
              ) {
                //found next match
                console.log("found next game!");
                //set intended teams to be playing
                scheduleLeftTeamName = cur["TM_A"];
                scheduleRightTeamName = cur["TM_B"];

                let leftLogo = TEAM_LOGO_MAP[cur["TM_A"]];
                let rightLogo = TEAM_LOGO_MAP[cur["TM_B"]];

                //set logos
                $(".preGame .preview .images .left.team img").attr(
                  "src",
                  leftLogo
                );
                $(".preGame .preview .images .right.team img").attr(
                  "src",
                  rightLogo
                );

                //Set stats on pregame page
                GetStats(cur["TM_A"], cur["TM_B"]);
                break;
              }
            }
          });
        });
      });
  } catch (e) {
    console.error("Error updating google sheet", e);
    return -1;
  }
};

/**
 * sheetUpdater function takes team info and game info and updates the master spreadsheet
 *
 * @param {TM_A} string name of the first team
 * @param {TM_A_SCR} int first team's score
 * @param {TM_B} string name of the second team
 * @param {TM_B_SCR} int second team's score
 * @param {write} bool true for write to sheet
 *
 * @returns -1 for failure, 0 for success
 */
exports.sheetUpdater = function (TM_A, TM_A_SCR, TM_B, TM_B_SCR, write) {
  if (
    TM_A !== undefined &&
    TM_A_SCR !== undefined &&
    TM_B !== undefined &&
    TM_B_SCR !== undefined
  ) {
    const { GoogleSpreadsheet } = require("google-spreadsheet");
    const SEASON_NUMBER = ENV_MAP["SEASON_NUMBER"];
    const GOOGLE_SERVICE_ACCOUNT_EMAIL =
      ENV_MAP["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
    const GOOGLE_PRIVATE_KEY = ENV_MAP["GOOGLE_PRIVATE_KEY"];
    const GOOGLE_SHEETS_SHEET_ID = ENV_MAP["GOOGLE_SHEETS_SHEET_ID"];
    const ROOM_NAME = ENV_MAP["ROOM_NAME"];
    const AUTO_SCORE = ENV_MAP["AUTO_SCORE"];

    const privateKey = GOOGLE_PRIVATE_KEY;
    const sheetId = GOOGLE_SHEETS_SHEET_ID;
    const email = GOOGLE_SERVICE_ACCOUNT_EMAIL;

    // required env vars
    if (!SEASON_NUMBER) {
      console.log("Required SEASON_NUMBER environment variable not found.");
      return -1;
    }
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.log("no GOOGLE_SERVICE_ACCOUNT_EMAIL env var set");
      return -1;
    }
    if (!GOOGLE_PRIVATE_KEY) {
      console.log("no GOOGLE_PRIVATE_KEY env var set");
      return -1;
    }
    if (!GOOGLE_SHEETS_SHEET_ID) {
      // spreadsheet key is the long id in the sheets URL
      console.log("no GOOGLE_SHEETS_SHEET_ID env var set");
      return -1;
    }
    if (!ROOM_NAME) {
      // spreadsheet key is the long id in the sheets URL
      console.log("no ROOM_NAME env var set");
      return -1;
    }
    if (!AUTO_SCORE) {
      // spreadsheet key is the long id in the sheets URL
      console.log("no ROOM_NAME env var set");
      return -1;
    }

    //Write to Sheet if AUTO_SCORE is set to true
    if (AUTO_SCORE) {
      try {
        const doc = new GoogleSpreadsheet(sheetId);
        doc
          .useServiceAccountAuth({
            client_email: email,
            private_key: privateKey.replace(/\\n/g, "\n"),
          })
          .then(() => {
            doc.loadInfo().then(async () => {
              /**
               * 0: Standings
               * 1: Leaderboards
               * 2: Schedule
               * 3: Playoff Bracket
               * 4: Players
               * 5: Roster
               * 6: Stats
               * 7: EXPORT
               * 8: OBS
               * 9: OBS Scroll
               * 10: SubList
               * 11: ScheduleForm
               * 12: rll-score-updater
               *
               *
               * *ROLES removed S4
               */
              //writing to sheet
              if (write) {
                const sheet = doc.sheetsByTitle["ScheduleRows"];

                sheet.getRows().then((rows) => {
                  // get the next un-recorded row
                  let i = 0;
                  const len = rows.length;
                  let found = false;

                  for (let x = 0; x < len; x++) {
                    let cur = rows[x];

                    //check if team names are undefined
                    if (
                      cur["TM_A"] === undefined ||
                      cur["TM_B"] === undefined
                    ) {
                      //skip
                      continue;
                    }

                    //check if teams fit
                    if (
                      cur["TM_A"].toUpperCase() === TM_A.toUpperCase() &&
                      cur["TM_B"].toUpperCase() === TM_B.toUpperCase() &&
                      cur["TM_A_SCR"] === "" &&
                      cur["TM_B_SCR"] === "" &&
                      cur["ROOM"] === ROOM_NAME
                    ) {
                      //found and teams in correct format
                      //send row to cell writer
                      AddScores(sheet, cur, TM_A_SCR, TM_B_SCR);
                      found = true;
                      break;
                    } else if (
                      cur["TM_A"].toUpperCase() === TM_B.toUpperCase() &&
                      cur["TM_B"].toUpperCase() === TM_A.toUpperCase() &&
                      cur["TM_A_SCR"] === "" &&
                      cur["TM_B_SCR"] === "" &&
                      cur["ROOM"] === ROOM_NAME
                    ) {
                      //found and teams in backwards format
                      //send row to cell writer
                      AddScores(sheet, cur, TM_B_SCR, TM_A_SCR);
                      found = true;
                      break;
                    }
                    i++;
                  }
                  //save sheet updates
                });
              } else {
                //MAP TO TOURNAMENT VIEW FOR IN BETWEEN GAMES
                /*
                const playOffSh = doc.sheetsByIndex[3];
                playOffSh.loadCells("A1:AA47").then(() => {
                  //RR Gshow1 Match 1
                  $(".round.a .gshow1 .tm.t .name").text(
                    playOffSh.getCellByA1("H18").value
                  );
                });
                */
              }
            });
          });
      } catch (e) {
        console.error("Error updating google sheet", e);
        return -1;
      }
    }

    return 0;
  } else {
    console.log("made it here NG");
    return -1;
  }
};

function AddScores(sheet, row, TM_A_SCR, TM_B_SCR) {
  let TM_A_AUTO_COL = 25 - 1;
  let TM_B_AUTO_COL = 26 - 1;

  sheet.loadCells("A1:AA300").then(() => {
    const TM_A_AUTO_SCORE_CELL = sheet.getCell(row.rowIndex - 1, TM_A_AUTO_COL);
    const TM_B_AUTO_SCORE_CELL = sheet.getCell(row.rowIndex - 1, TM_B_AUTO_COL);
    TM_A_AUTO_SCORE_CELL.value = TM_A_SCR;
    TM_B_AUTO_SCORE_CELL.value = TM_B_SCR;

    //save sheet updates
    sheet.saveUpdatedCells();
  });
}
