//require("dotenv").config();

/**
 * sheetUpdater function takes team info and game info and updates the master spreadsheet
 *
 * @param {team0Name} string name of the first team
 * @param {team0Score} int first team's score
 * @param {team1Name} string name of the second team
 * @param {team1Score} int second team's score
 *
 * @returns -1 for failure, 0 for success
 */
exports.sheetUpdater = function (
  team0Name,
  team0Score,
  team1Name,
  team1Score,
  write
) {
  if (
    team0Name !== undefined &&
    team0Score !== undefined &&
    team1Name !== undefined &&
    team1Score !== undefined
  ) {
    const { GoogleSpreadsheet } = require("google-spreadsheet");
    const SEASON_NUMBER = ENV_MAP["SEASON_NUMBER"];
    const GOOGLE_SERVICE_ACCOUNT_EMAIL =
      ENV_MAP["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
    const GOOGLE_PRIVATE_KEY = ENV_MAP["GOOGLE_PRIVATE_KEY"];
    const GOOGLE_SHEETS_SHEET_ID = ENV_MAP["GOOGLE_SHEETS_SHEET_ID"];

    const privateKey = GOOGLE_PRIVATE_KEY;
    const sheetId = GOOGLE_SHEETS_SHEET_ID;
    const email = GOOGLE_SERVICE_ACCOUNT_EMAIL;

    console.log("made it here");

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
              const sheet = doc.sheetsByIndex[12];

              sheet.getRows().then((rows) => {
                // get the next un-recorded row
                let i = 0;
                const len = rows.length;
                let found = false;

                for (let x = 0; x < len; x++) {
                  let cur = rows[x];

                  //check if team names are undefined
                  if (
                    cur["team0name"] === undefined ||
                    cur["team1name"] === undefined
                  ) {
                    //skip
                    continue;
                  }

                  //check if teams fit
                  if (
                    cur["team0name"].toUpperCase() ===
                      team0Name.toUpperCase() &&
                    cur["team1name"].toUpperCase() ===
                      team1Name.toUpperCase() &&
                    cur["team0score"] === undefined &&
                    cur["team1score"] === undefined
                  ) {
                    //found and teams in correct format
                    cur["team0score"] = team0Score;
                    cur["team1score"] = team1Score;
                    found = true;
                    break;
                  } else if (
                    cur["team0name"].toUpperCase() ===
                      team1Name.toUpperCase() &&
                    cur["team1name"].toUpperCase() ===
                      team0Name.toUpperCase() &&
                    cur["team0score"] === undefined &&
                    cur["team1score"] === undefined
                  ) {
                    //found and teams in backwards format
                    cur["team0score"] = team1Score;
                    cur["team1score"] = team0Score;
                    found = true;
                    break;
                  }
                  i++;
                }
                //save sheet updates
                if (found) {
                  rows[i].save();
                }
              });
            } else {
              //MAP TO TOURNAMENT VIEW FOR IN BETWEEN GAMES
              const playOffSh = doc.sheetsByIndex[3];
              playOffSh.loadCells("A1:AA47").then(() => {
                //RR Gshow1 Match 1
                $(".round.a .gshow1 .tm.t .name").text(
                  playOffSh.getCellByA1("H18").value
                );
                $(".round.a .gshow1 .tm.b .name").text(
                  playOffSh.getCellByA1("H19").value
                );
                $(".round.a .gshow1 .tm.t .g1").text(
                  playOffSh.getCellByA1("I18").value
                );
                $(".round.a .gshow1 .tm.b .g1").text(
                  playOffSh.getCellByA1("I19").value
                );
                $(".round.a .gshow1 .tm.t .g2").text(
                  playOffSh.getCellByA1("J18").value
                );
                $(".round.a .gshow1 .tm.b .g2").text(
                  playOffSh.getCellByA1("J19").value
                );
                $(".round.a .gshow1 .tm.t .pts").text(
                  playOffSh.getCellByA1("K18").value
                );
                $(".round.a .gshow1 .tm.b .pts").text(
                  playOffSh.getCellByA1("K19").value
                );
                $(".round.a .gshow1 .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H18").value]
                );
                $(".round.a .gshow1 .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H19").value]
                );

                //RR gshow1 Match 2
                $(".round.b .gshow1 .tm.t .name").text(
                  playOffSh.getCellByA1("H20").value
                );
                $(".round.b .gshow1 .tm.b .name").text(
                  playOffSh.getCellByA1("H21").value
                );
                $(".round.b .gshow1 .tm.t .g1").text(
                  playOffSh.getCellByA1("I20").value
                );
                $(".round.b .gshow1 .tm.b .g1").text(
                  playOffSh.getCellByA1("I21").value
                );
                $(".round.b .gshow1 .tm.t .g2").text(
                  playOffSh.getCellByA1("J20").value
                );
                $(".round.b .gshow1 .tm.b .g2").text(
                  playOffSh.getCellByA1("J21").value
                );
                $(".round.b .gshow1 .tm.t .pts").text(
                  playOffSh.getCellByA1("K20").value
                );
                $(".round.b .gshow1 .tm.b .pts").text(
                  playOffSh.getCellByA1("K21").value
                );
                $(".round.b .gshow1 .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H20").value]
                );
                $(".round.b .gshow1 .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H21").value]
                );

                //RR gshow1 Match 3
                $(".round.c .gshow1 .tm.t .name").text(
                  playOffSh.getCellByA1("H22").value
                );
                $(".round.c .gshow1 .tm.b .name").text(
                  playOffSh.getCellByA1("H23").value
                );
                $(".round.c .gshow1 .tm.t .g1").text(
                  playOffSh.getCellByA1("I22").value
                );
                $(".round.c .gshow1 .tm.b .g1").text(
                  playOffSh.getCellByA1("I23").value
                );
                $(".round.c .gshow1 .tm.t .g2").text(
                  playOffSh.getCellByA1("J22").value
                );
                $(".round.c .gshow1 .tm.b .g2").text(
                  playOffSh.getCellByA1("J23").value
                );
                $(".round.c .gshow1 .tm.t .pts").text(
                  playOffSh.getCellByA1("K22").value
                );
                $(".round.c .gshow1 .tm.b .pts").text(
                  playOffSh.getCellByA1("K23").value
                );
                $(".round.c .gshow1 .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H22").value]
                );
                $(".round.c .gshow1 .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H23").value]
                );

                //RR gshow2 Match 1
                $(".round.a .gshow2 .tm.t .name").text(
                  playOffSh.getCellByA1("X18").value
                );
                $(".round.a .gshow2 .tm.b .name").text(
                  playOffSh.getCellByA1("X19").value
                );
                $(".round.a .gshow2 .tm.t .g1").text(
                  playOffSh.getCellByA1("Y18").value
                );
                $(".round.a .gshow2 .tm.b .g1").text(
                  playOffSh.getCellByA1("Y19").value
                );
                $(".round.a .gshow2 .tm.t .g2").text(
                  playOffSh.getCellByA1("Z18").value
                );
                $(".round.a .gshow2 .tm.b .g2").text(
                  playOffSh.getCellByA1("Z19").value
                );
                $(".round.a .gshow2 .tm.t .pts").text(
                  playOffSh.getCellByA1("AA18").value
                );
                $(".round.a .gshow2 .tm.b .pts").text(
                  playOffSh.getCellByA1("AA19").value
                );
                $(".round.a .gshow2 .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X18").value]
                );
                $(".round.a .gshow2 .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X19").value]
                );

                //RR gshow2 Match 2
                $(".round.b .gshow2 .tm.t .name").text(
                  playOffSh.getCellByA1("X20").value
                );
                $(".round.b .gshow2 .tm.b .name").text(
                  playOffSh.getCellByA1("X21").value
                );
                $(".round.b .gshow2 .tm.t .g1").text(
                  playOffSh.getCellByA1("Y20").value
                );
                $(".round.b .gshow2 .tm.b .g1").text(
                  playOffSh.getCellByA1("Y21").value
                );
                $(".round.b .gshow2 .tm.t .g2").text(
                  playOffSh.getCellByA1("Z20").value
                );
                $(".round.b .gshow2 .tm.b .g2").text(
                  playOffSh.getCellByA1("Z21").value
                );
                $(".round.b .gshow2 .tm.t .pts").text(
                  playOffSh.getCellByA1("AA20").value
                );
                $(".round.b .gshow2 .tm.b .pts").text(
                  playOffSh.getCellByA1("AA21").value
                );
                $(".round.b .gshow2 .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X20").value]
                );
                $(".round.b .gshow2 .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X21").value]
                );

                //RR gshow2 Match 3
                $(".round.c .gshow2 .tm.t .name").text(
                  playOffSh.getCellByA1("X22").value
                );
                $(".round.c .gshow2 .tm.b .name").text(
                  playOffSh.getCellByA1("X23").value
                );
                $(".round.c .gshow2 .tm.t .g1").text(
                  playOffSh.getCellByA1("Y22").value
                );
                $(".round.c .gshow2 .tm.b .g1").text(
                  playOffSh.getCellByA1("Y23").value
                );
                $(".round.c .gshow2 .tm.t .g2").text(
                  playOffSh.getCellByA1("Z22").value
                );
                $(".round.c .gshow2 .tm.b .g2").text(
                  playOffSh.getCellByA1("Z23").value
                );
                $(".round.c .gshow2 .tm.t .pts").text(
                  playOffSh.getCellByA1("AA22").value
                );
                $(".round.c .gshow2 .tm.b .pts").text(
                  playOffSh.getCellByA1("AA23").value
                );
                $(".round.c .gshow2 .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X22").value]
                );
                $(".round.c .gshow2 .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X23").value]
                );

                //GET STANDINGS INFO GROUP A
                $(".standings .group.a .seed.1 .rank").text(
                  playOffSh.getCellByA1("F10").value
                );
                $(".standings .group.a .seed.2 .rank").text(
                  playOffSh.getCellByA1("F11").value
                );
                $(".standings .group.a .seed.3 .rank").text(
                  playOffSh.getCellByA1("F12").value
                );
                $(".standings .group.a .seed.1 .name").text(
                  playOffSh.getCellByA1("H10").value
                );
                $(".standings .group.a .seed.2 .name").text(
                  playOffSh.getCellByA1("H11").value
                );
                $(".standings .group.a .seed.3 .name").text(
                  playOffSh.getCellByA1("H12").value
                );
                $(".standings .group.a .seed.1 .points").text(
                  playOffSh.getCellByA1("I10").value
                );
                $(".standings .group.a .seed.2 .points").text(
                  playOffSh.getCellByA1("I11").value
                );
                $(".standings .group.a .seed.3 .points").text(
                  playOffSh.getCellByA1("I12").value
                );
                $(".standings .group.a .seed.1 .diff").text(
                  playOffSh.getCellByA1("J10").value
                );
                $(".standings .group.a .seed.2 .diff").text(
                  playOffSh.getCellByA1("J11").value
                );
                $(".standings .group.a .seed.3 .diff").text(
                  playOffSh.getCellByA1("J12").value
                );
                $(".standings .group.a .seed.1 .gf").text(
                  playOffSh.getCellByA1("K10").value
                );
                $(".standings .group.a .seed.2 .gf").text(
                  playOffSh.getCellByA1("K11").value
                );
                $(".standings .group.a .seed.3 .gf").text(
                  playOffSh.getCellByA1("K12").value
                );
                $(".standings .group.a .seed.1 img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H10").value]
                );
                $(".standings .group.a .seed.2 img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H11").value]
                );
                $(".standings .group.a .seed.3 img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H12").value]
                );

                //GET STANDINGS INFO GROUP B
                $(".standings .group.b .seed.1 .rank").text(
                  playOffSh.getCellByA1("V10").value
                );
                $(".standings .group.b .seed.2 .rank").text(
                  playOffSh.getCellByA1("V11").value
                );
                $(".standings .group.b .seed.3 .rank").text(
                  playOffSh.getCellByA1("V12").value
                );
                $(".standings .group.b .seed.1 .name").text(
                  playOffSh.getCellByA1("X10").value
                );
                $(".standings .group.b .seed.2 .name").text(
                  playOffSh.getCellByA1("X11").value
                );
                $(".standings .group.b .seed.3 .name").text(
                  playOffSh.getCellByA1("X12").value
                );
                $(".standings .group.b .seed.1 .points").text(
                  playOffSh.getCellByA1("Y10").value
                );
                $(".standings .group.b .seed.2 .points").text(
                  playOffSh.getCellByA1("Y11").value
                );
                $(".standings .group.b .seed.3 .points").text(
                  playOffSh.getCellByA1("Y12").value
                );
                $(".standings .group.b .seed.1 .diff").text(
                  playOffSh.getCellByA1("Z10").value
                );
                $(".standings .group.b .seed.2 .diff").text(
                  playOffSh.getCellByA1("Z11").value
                );
                $(".standings .group.b .seed.3 .diff").text(
                  playOffSh.getCellByA1("Z12").value
                );
                $(".standings .group.b .seed.1 .gf").text(
                  playOffSh.getCellByA1("AA10").value
                );
                $(".standings .group.b .seed.2 .gf").text(
                  playOffSh.getCellByA1("AA11").value
                );
                $(".standings .group.b .seed.3 .gf").text(
                  playOffSh.getCellByA1("AA12").value
                );
                $(".standings .group.b .seed.1 img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X10").value]
                );
                $(".standings .group.b .seed.2 img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X11").value]
                );
                $(".standings .group.b .seed.3 img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X12").value]
                );

                //GET SEMIS INFO LEFT
                $(".ff .top.third .left.match .tm.t .name").text(
                  playOffSh.getCellByA1("H36").value
                );
                $(".ff .top.third .left.match .tm.t .g.1").text(
                  playOffSh.getCellByA1("I36").value
                );
                $(".ff .top.third .left.match .tm.t .g.2").text(
                  playOffSh.getCellByA1("J36").value
                );
                $(".ff .top.third .left.match .tm.t .g.3").text(
                  playOffSh.getCellByA1("K36").value
                );
                $(".ff .top.third .left.match .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H36").value]
                );
                $(".ff .top.third .left.match .tm.b .name").text(
                  playOffSh.getCellByA1("H37").value
                );
                $(".ff .top.third .left.match .tm.b .g.1").text(
                  playOffSh.getCellByA1("I37").value
                );
                $(".ff .top.third .left.match .tm.b .g.2").text(
                  playOffSh.getCellByA1("J37").value
                );
                $(".ff .top.third .left.match .tm.b .g.3").text(
                  playOffSh.getCellByA1("K37").value
                );
                $(".ff .top.third .left.match .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H37").value]
                );

                //GET SEMIS INFO RIGHT
                $(".ff .top.third .right.match .tm.t .name").text(
                  playOffSh.getCellByA1("X36").value
                );
                $(".ff .top.third .right.match .tm.t .g.1").text(
                  playOffSh.getCellByA1("Y36").value
                );
                $(".ff .top.third .right.match .tm.t .g.2").text(
                  playOffSh.getCellByA1("Z36").value
                );
                $(".ff .top.third .right.match .tm.t .g.3").text(
                  playOffSh.getCellByA1("AA36").value
                );
                $(".ff .top.third .right.match .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X36").value]
                );
                $(".ff .top.third .right.match .tm.b .name").text(
                  playOffSh.getCellByA1("X37").value
                );
                $(".ff .top.third .right.match .tm.b .g.1").text(
                  playOffSh.getCellByA1("Y37").value
                );
                $(".ff .top.third .right.match .tm.b .g.2").text(
                  playOffSh.getCellByA1("Z37").value
                );
                $(".ff .top.third .right.match .tm.b .g.3").text(
                  playOffSh.getCellByA1("AA37").value
                );
                $(".ff .top.third .right.match .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X37").value]
                );

                //GET CONS INFO LEFT
                $(".ff .mid.third .left.match .score.left").text(
                  playOffSh.getCellByA1("I41").value
                );
                $(".ff .mid.third .left.match .score.right").text(
                  playOffSh.getCellByA1("I42").value
                );
                $(".ff .mid.third .left.match .logo.left img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H41").value]
                );
                $(".ff .mid.third .left.match .logo.right img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H42").value]
                );

                //GET CONS INFO RIGHT
                $(".ff .mid.third .right.match .score.left").text(
                  playOffSh.getCellByA1("Y41").value
                );
                $(".ff .mid.third .right.match .score.right").text(
                  playOffSh.getCellByA1("Y42").value
                );
                $(".ff .mid.third .right.match .logo.left img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X41").value]
                );
                $(".ff .mid.third .right.match .logo.right img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("X42").value]
                );

                //GET CHAMP INFO
                $(".ff .bot.third .tm.t .name").text(
                  playOffSh.getCellByA1("H46").value
                );
                $(".ff .bot.third .tm.t .g.1").text(
                  playOffSh.getCellByA1("I46").value
                );
                $(".ff .bot.third .tm.t .g.2").text(
                  playOffSh.getCellByA1("J46").value
                );
                $(".ff .bot.third .tm.t .g.3").text(
                  playOffSh.getCellByA1("K46").value
                );
                $(".ff .bot.third .tm.t .g.4").text(
                  playOffSh.getCellByA1("S46").value
                );
                $(".ff .bot.third .tm.t .g.5").text(
                  playOffSh.getCellByA1("T46").value
                );
                $(".ff .bot.third .tm.t img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H46").value]
                );
                $(".ff .bot.third .tm.b .name").text(
                  playOffSh.getCellByA1("H47").value
                );
                $(".ff .bot.third .tm.b .g.1").text(
                  playOffSh.getCellByA1("I47").value
                );
                $(".ff .bot.third .tm.b .g.2").text(
                  playOffSh.getCellByA1("J47").value
                );
                $(".ff .bot.third .tm.b .g.3").text(
                  playOffSh.getCellByA1("K47").value
                );
                $(".ff .bot.third .tm.b .g.4").text(
                  playOffSh.getCellByA1("S47").value
                );
                $(".ff .bot.third .tm.b .g.5").text(
                  playOffSh.getCellByA1("T47").value
                );
                $(".ff .bot.third .tm.b img").attr(
                  "src",
                  TEAM_LOGO_MAP[playOffSh.getCellByA1("H47").value]
                );
              });
            }
          });
        });
    } catch (e) {
      console.error("Error updating google sheet", e);
      return -1;
    }

    return 0;
  } else {
    console.log("made it here NG");
    return -1;
  }
};
