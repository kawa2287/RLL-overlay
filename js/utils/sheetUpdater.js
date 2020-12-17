(function () {
  const { GoogleSpreadsheet } = require("google-spreadsheet");
  require("dotenv").config();

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
  const sheetUpdater = (team0Name, team0Score, team1Name, team1Score) => {
    const {
      SEASON_NUMBER,
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEETS_SHEET_ID,
    } = process.env;

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
      const email = GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = GOOGLE_PRIVATE_KEY;
      const sheetId = GOOGLE_SHEETS_SHEET_ID;

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
             * 8: ROLES*
             *
             * *ROLES removed S4
             */
            const scheduleSheet = doc.sheetsByIndex[2];

            scheduleSheet.getRows().then((rows) => {
              // get the next un-recorded row
              let i = 0;
              const len = rows.length;
              let found = false;
              let team0First = true;
              let gameNum = "G1"; // true means G1 is done and this is G2
              while (i < len && !found) {
                i++;
                const cur = rows[i];
                if (cur && cur["Name"] && (!!!cur["G1"] || !!!cur["G2"])) {
                  // row valid, missing at least one of the game's scores, has team name
                  if (
                    cur["Name"].toLowerCase() === team0Name &&
                    rows[i + 1]["Name"].toLowerCase() === team1Name
                  ) {
                    // team0 then team1
                    found = true; // done
                  } else if (
                    cur["Name"].toLowerCase() === team1Name &&
                    rows[i + 1]["Name"].toLowerCase() === team0Name
                  ) {
                    // team1 then team0
                    found = true; // done
                    team0First = false;
                  }

                  if (found) {
                    gameNum = !!cur["G1"] ? "G2" : "G1";
                  }
                }
              }
              const team0Row = team0First ? rows[i] : rows[i + 1];
              const team1Row = team0First ? rows[i + 1] : rows[i];

              team0Row[gameNum] = team0Score;
              team1Row[gameNum] = team1Score;

              team0Row.save();
              team1Row.save();
            });
          });
        });
    } catch (e) {
      console.error("Error updating google sheet", e);
      return -1;
    }

    return 0;
  };
})();
