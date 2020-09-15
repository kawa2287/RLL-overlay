let counter = 0;
let ballHistory = [];
function GameUpdateMain(d)
{
    counter++;
    //Set Global Player Teams Array
    globPlayerTmsArr = GetPlayerTeamArray(d);

    //store team info
    let blueTeam = [];
    let orangeTeam = [];
    let allPlayers = [];

    let players = d['players'];

    for (var key of Object.keys(players)) {
        if(players[key].team === 0)
        {
            blueTeam.push(players[key]);
        }
        else
        {
            orangeTeam.push(players[key]);
        }
        allPlayers.push(players[key]);
    }

    //Update Time
    $(".scorebug .rightcontainer").text(secondsToMS(d['game']['time']));

    //Update Score
    $(".scorebug .team.left .score").text(d['game']['teams'][0]['score'] );
    $(".scorebug .team.right .score").text(d['game']['teams'][1]['score'] );

    //Update Stats
    let isReplay = d['game']['isReplay'];

    UpdateStats(blueTeam, 0, ".p1", "blue", isReplay);
    UpdateStats(blueTeam, 1, ".p2", "blue", isReplay);
    UpdateStats(blueTeam, 2, ".p3", "blue", isReplay);

    UpdateStats(orangeTeam, 0, ".p1", "orange", isReplay);
    UpdateStats(orangeTeam, 1, ".p2", "orange", isReplay);
    UpdateStats(orangeTeam, 2, ".p3", "orange", isReplay);
    
    //Determine Team & Logo
    leftTeamName = GetTeam(blueTeam);
    rightTeamName = GetTeam(orangeTeam);
    
    $(".scorebug .left .name").text(leftTeamName);
    $(".scorebug .right .name").text(rightTeamName);
    $(".scorebug .left .logo img").attr("src",TEAM_BANNER_MAP[leftTeamName]);
    $(".scorebug .right .logo img").attr("src",TEAM_BANNER_MAP[rightTeamName]);

    // if (d['game']['ballSpeed'] !== 0) {
    if (counter < 50 && d['game']['ballSpeed'] !== 0) {
        const ballPos = {
            "x": d['game']['ballX'],
            "y": d['game']['ballY']
        };
        ballHistory.push(ballPos);
    } else {
        const ballPos = {
            "x": d['game']['ballX'],
            "y": d['game']['ballY']
        };
        ballHistory.push(ballPos);
        updateHeatmap(ballHistory);
        counter = 0;
        ballHistory = [];
    }

    // updateHeatmap(ballPos);

    // Update Player Scores
    AddStats(allPlayers);

    //Save State
    previousData = d;
}

function GetPlayerTeamArray(d)
{
    let players = d['players'];
    let playerTeamArray = [];

    for (var key of Object.keys(players)) {
        if(players[key].team === 0)
        {
            playerTeamArray.push([players[key], "blue"]);
        }
        else
        {
            playerTeamArray.push([players[key], "orange"]);
        }
    }

    return playerTeamArray;
}

function UpdateStats(teamArray, indexNum, p, color, isReplay)
{
    const q = `.${color}Team ${p}`;
    
    if(teamArray[indexNum] !== undefined)
    {
        $(q).css({ "visibility": "visible" });

        //Boost
        if(!isReplay)
        {
            progress(teamArray[indexNum]['boost'], $(q+ " .bar"));
        }

        //Name
        $(q + " .name").text(teamArray[indexNum]['name']);

        //Shots
        $(q + " .shots").text(teamArray[indexNum]['shots']);

        //Goals
        $(q + " .goals").text(teamArray[indexNum]['goals']);

        //Assists
        $(q + " .assists").text(teamArray[indexNum]['assists']);

        //Saves
        $(q + " .saves").text(teamArray[indexNum]['saves']);
        
        //Check if Dead
        if(teamArray[indexNum]['isDead'])
        {
            $(q).css({"opacity": 0.5});
        }
        else
        {
            $(q).css({ "opacity": 1 });
        }
    }
    else
    {
        $(q).css({ "visibility": "hidden" });
    }
};

function progress(percent, $element) 
{
    $element.css({ width: percent + "%" });
}

function GetTeam(team)
{
    //initial object
    let teams = 
    {
        "RLL": 0,
        "Crabs": 0,
        "Knights": 0,
        "Pigeons": 0,
        "Queens": 0,
        "LongBows": 0,
        "Samurai": 0
    };

    //loop through players
    for(let i = 0; i < team.length; i++)
    {
        teams[PLAYER_TEAM_MAP[team[i]['name']]] += 1;
    }

    //push to sortable array
    let sortList = [];
    for (let team in teams) {
        sortList.push([team, teams[team]]);
    }

    //sort
    sortList.sort(function(a, b) {
        return b[1] - a[1];
    });

    //return
    return sortList[0][0];
}


function AddStats(players)
{

    //push to sorting array
    let sortList = [];
    for (let p in players) {
        sortList.push([players[p]['name'], players[p]['score']]);
    }

    //sort
    sortList.sort(function(a, b) {
        return b[1] - a[1];
    });

    //set to divs
    for(let i = 0; i < sortList.length; i++)
    {
        SetDiv(sortList[i], ".p" + (i+1).toString());
    }
    
}

function SetDiv(playerInfo, p)
{
    let q = ".scoreChart .driver" + p;
    //Set Values
    $(q + " .name").text(playerInfo[0]);
    $(q + " .score").text(playerInfo[1]);
    //Set ID
    $(q).attr('id', playerInfo[0]);
}