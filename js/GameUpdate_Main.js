function GameUpdateMain(d)
{
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

        UpdateStats(blueTeam, 0, ".p1","blue",isReplay,d);
        UpdateStats(blueTeam, 1, ".p2","blue",isReplay,d);
        UpdateStats(blueTeam, 2, ".p3","blue",isReplay,d);

        UpdateStats(orangeTeam, 0, ".p1","orange",isReplay,d);
        UpdateStats(orangeTeam, 1, ".p2","orange",isReplay,d);
        UpdateStats(orangeTeam, 2, ".p3","orange",isReplay,d);
        
        //Determine Team & Logo
        leftTeamName = GetTeam(blueTeam)
        rightTeamName = GetTeam(orangeTeam)
        
        $(".scorebug .left .name").text(leftTeamName);
        $(".scorebug .right .name").text(rightTeamName);
        $(".scorebug .left .logo img").attr("src",TEAM_LOGO_MAP[leftTeamName]);
        $(".scorebug .right .logo img").attr("src",TEAM_LOGO_MAP[rightTeamName]);

        // Update Player Scores
        AddStats(allPlayers,d);

        //Show Target Player Stats if focused
        TargetStats(allPlayers,d);

        //test
        console.log(playerAdvStats);

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
            playerTeamArray.push([players[key],"blue"]);
        }
        else
        {
            playerTeamArray.push([players[key],"orange"]);
        }
    }
    return playerTeamArray;
}

function UpdateStats(teamArray, indexNum, p, color, isReplay,d)
{
    const q = `.${color}Team ${p}`;

    
    if(teamArray[indexNum] !== undefined)
    {
        $(q).css({"visibility":"visible" });

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
            $(q).css({"opacity":.5});
        }
        else
        {
            $(q).css({"opacity":1});
        }

        //check if player exists in the adv stats obj
        if(playerAdvStats[teamArray[indexNum]['name']] === undefined)
        {
            //add player to adv stats
            playerAdvStats[teamArray[indexNum]['name']] = {
                airTime:0,
                airHits:0
            }
        }
        else
        {
            if(previousData !== undefined)
            {
                //check if game clock is running still
                if(d['game']['time'] !== previousData['game']['time'])
                {
                    //player exists --> add adv stats
                    AirStats(teamArray[indexNum]);
                } 

            }
            
        }
    }
    else
    {
        $(q).css({"visibility":"hidden" });
    }
};

function progress(percent, $element) 
{
    $element.css({ width: percent +"%" });
}

function GetTeam(team)
{
    //initial object
    let teams = 
    {
        "RLL":0,
        "Crabs" : 0,
        "Knights":0,
        "Pigeons":0,
        "Queens":0,
        "LongBows":0,
        "Samurai":0
    };

    //loop through players
    for(var i = 0; i < team.length; i++)
    {
        teams[PLAYER_TEAM_MAP[team[i]['name']]] += 1;
    }

    //push to sortable array
    var sortList = [];
    for (var team in teams) {
        sortList.push([team, teams[team]]);
    }

    //sort
    sortList.sort(function(a, b) {
        return b[1] - a[1];
    });

    //return
    return sortList[0][0];
}


function AddStats(players,d)
{
    //push to sorting array
    let sortList = [];
    for (var p in players) 
    {
        let sortStat = PickStat(players,p,d['game']['time']);
        sortList.push([players[p],sortStat]);
    }

    //sort
    sortList.sort(function(a, b) {
        return b[1] - a[1];
    });

    //set to divs
    for(var i = 0; i < sortList.length; i++)
    {
        SetDiv(sortList[i], ".p" + (i+1).toString());
    }
}

function SetDiv(playerInfo, p)
{
    //set colors and logos
    let team = playerInfo[0]['team'];

    //Set Team Goal Icon and Colors
    let teamName =  (team === 0 ? leftTeamName : rightTeamName);
    let logo = TEAM_LOGO_MAP[teamName] ;
    let color = (team === 0 ? "blue" :  "rgba(223, 126, 0, 1)");

    let q = ".scoreChart .driver" + p;
    //Set Values
    $(q).css({"background":color});
    $(q + " .logo img").attr("src", logo);
    $(q + " .name").text(playerInfo[0]['name']);
    $(q + " .score").text(playerInfo[1]);
    //Set ID
    $(q).attr('id', playerInfo[0]);
}

function PickStat(players,p,gameTime)
{
    
    let s = GetSeconds(gameTime);
    if (s < 60 && s>= 50)
    {
        $(".scoreChart .title").text("SCORE");
        return players[p]['score'];
    };
    if (s < 50 && s>= 40)
    {
        $(".scoreChart .title").text("BALL TOUCHES");
        return players[p]['touches']};
    if (s < 40 && s>= 30)
    {
        $(".scoreChart .title").text("CAR BUMPS");
        return players[p]['cartouches'];
    };
    if (s < 30 && s>= 20)
    {
        $(".scoreChart .title").text("POINTS");
        return players[p]['goals'] + players[p]['assists'];
    };
    if (s < 20 && s>= 10)
    {
        $(".scoreChart .title").text("SCORE POINTS/TOUCH");
        if(players[p]['touches'] === 0)
        {
            return 0;
        }
        else
        {
            return (players[p]['score']/players[p]['touches']).toFixed(2);;
        }
        
    };
    if (s < 10 && s>= 0)
    {
        $(".scoreChart .title").text("SCORE RANKINGS");
        return  players[p]['score'];
    };
    return  players[p]['score'];
}

function TargetStats(players, d)
{
    //Check if director has player targeted
    if(d['game']['hasTarget'])
    {
        //make targetDisplay Visible
        $(".targetDisplay").css({"visibility":"visible"});
        //fill out stats
        let target = d['game']['target'];
        for(let i = 0; i < players.length; i++)
        {
            if(players[i]['id'] === target)
            {
                //set stats
                $(".targetDisplay .player .name").text(players[i]['name']);
                $(".targetDisplay .player .score").text(players[i]['score']);
                $(".targetDisplay .player .stat.points .value").text(players[i]['goals']+players[i]['assists']);
                $(".targetDisplay .player .stat.goals .value").text(players[i]['goals']);
                $(".targetDisplay .player .stat.assists .value").text(players[i]['assists']);
                $(".targetDisplay .player .stat.shots .value").text(players[i]['shots']);
                $(".targetDisplay .player .stat.saves .value").text(players[i]['saves']);
                $(".targetDisplay .player .stat.touches .value").text(players[i]['touches']);
                $(".targetDisplay .player .stat.bumps .value").text(players[i]['cartouches']);
                $(".targetDisplay .side.speed .middle").text(Math.ceil(players[i]['speed']*0.621371));
                progress(players[i]['boost'],$(".targetDisplay .player .bar"))

            
                
                //set colors and logos
                let team = players['team'];

                //Set Team Goal Icon and Colors
                let teamName =  (team === 0 ? leftTeamName : rightTeamName);
                let logo = TEAM_LOGO_MAP[teamName] ;
                let colors = TEAM_COLOR_MAP[teamName];
                let barColor;
                if(players[i]['team'] === 0)
                {
                    barColor = "linear-gradient(to right, blue 0%,blue 50%,rgb(134, 134, 255)  100%)";
                }
                else
                {
                    barColor = "linear-gradient(to right, rgba(223, 126, 0, 1), 0%,rgba(223, 126, 0, 1), 50%,rgb(255, 204, 136) 100%)";
                }

                //apply
                $(".targetDisplay img").attr("src", logo);
                $(".targetDisplay").css({"background":colors.primary});
                $(".targetDisplay .scoreTitle").css({"color":colors.secondary});
                $(".targetDisplay .side.speed .text").css({"color":colors.secondary});
                $(".targetDisplay .lowerCont").css({"color":colors.secondary});
                $(".targetDisplay .lowerCont").css({"background":colors.shadow});
                $(".targetDisplay .lowerCont .title").css({"background":colors.primary});
                $(".targetDisplay .progressBarCont .bar").css({"background" : barColor});
                
            }
        }

    }
    else
    {
        //hide targetDisplay
        $(".targetDisplay").css({"visibility":"hidden"})
    }
}