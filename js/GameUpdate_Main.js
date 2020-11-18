function GameUpdateMain(d)
{
    //Set Global Player Teams Array
        globPlayerTmsArr = GetPlayerTeamArray(d);

        //store team info
        let blueTeam = [];
        let orangeTeam = [];
        let allPlayers = []; 
        
        //Clear team Arrays
        teamShots = [0,0];
        teamScore = [0,0];
        teamTouches = [0,0];
        teamBumps = [0,0];

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

        //Determine Team & Logo
        leftTeamName = GetTeam(blueTeam);
        rightTeamName = GetTeam(orangeTeam);

        //Update Time
        $(".scorebug .mid.container .top").text(secondsToMS(d['game']['time']));

        //Update Score
        $(".scorebug .left.container .score span").text(d['game']['teams'][0]['score'] );
        $(".scorebug .right.container .score span").text(d['game']['teams'][1]['score'] );

        //Update Stats
        let isReplay = d['game']['isReplay'];

        UpdateStats(blueTeam, 0, ".p1","blue",isReplay,d);
        UpdateStats(blueTeam, 1, ".p2","blue",isReplay,d);
        UpdateStats(blueTeam, 2, ".p3","blue",isReplay,d);

        UpdateStats(orangeTeam, 0, ".p1","orange",isReplay,d);
        UpdateStats(orangeTeam, 1, ".p2","orange",isReplay,d);
        UpdateStats(orangeTeam, 2, ".p3","orange",isReplay,d);
        
        
        //Update Scorebug
        $(".scorebug .left .team span").text(leftTeamName);
        $(".scorebug .right .team span").text(rightTeamName);
        $(".scorebug .left .logo img").attr("src",TEAM_LOGO_MAP[leftTeamName]);
        $(".scorebug .right .logo img").attr("src",TEAM_LOGO_MAP[rightTeamName]);
        $(".scorebug .mid .shots .value").text(teamShots[0]);
        $(".scorebug .mid .shots .value").text(teamShots[1]);

        //Show Target Player Stats if focused
        TargetStats(allPlayers,d);

        //Shot map shots
        //MapShots();

        //Map player positions
        MapPositions(d);

        //Update map pics
        $(".mappics .team.left img").attr("src",TEAM_LOGO_MAP[leftTeamName]);
        $(".mappics .team.right img").attr("src",TEAM_LOGO_MAP[rightTeamName]);


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
    const q = `.${color} ${p}`;
    let tm = (color === 'blue' ? 0 : 1 );
    
    if(teamArray[indexNum] !== undefined)
    {
        $(q).css({"visibility":"visible" });

        //Boost
        /*
        if(!isReplay)
        {
            progress(teamArray[indexNum]['boost'], $(q+ " .bar"));
        }
        */

        //Shots
        teamShots[tm] += teamArray[indexNum]['shots'];

        //Name
        $(q + " .name").text(teamArray[indexNum]['name']);

        //Points
        let points = teamArray[indexNum]['goals'] + teamArray[indexNum]['assists'];
        $(q + " .points .value").text(points);

        //Score
        $(q + " .score .value").text(teamArray[indexNum]['score']);
        teamScore[tm] += teamArray[indexNum]['score'];

        //Logo
        $( q + " .logo img").attr("src",TEAM_LOGO_MAP[tm===0?leftTeamName:rightTeamName]);

        //check if player exists in the adv stats obj
        if(playerAdvStats[teamArray[indexNum]['name']] === undefined)
        {
            //add player to adv stats
            playerAdvStats[teamArray[indexNum]['name']] = {
                airTime:0,
                airHits:0,
                lastHit:{
                    x:0,
                    y:0,
                    z:0
                },
                position:{
                    x:0,
                    y:0,
                    z:0
                },
                team: "",
                demos:0,
                demoed:0,
                timeDhalf:0,
                timeOhalf:0,
                scoreDhalf:0,
                scoreOhalf:0,
                timeInDefGoal:0,
                timeInOffGoal:0,
                ballProx:0,
                nLMB:0,
                goalSpeed:0,
                epicSaves:0,
                aerialGoals:0,
                bicycleHits:0
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

                    //Check if player hit ball, if yes- save position
                    //LastHit(teamArray[indexNum]);

                    //Zone stats
                    ZoneStats(teamArray[indexNum]);
                } 

                //update player position
                let px = teamArray[indexNum]['x'];
                let py = teamArray[indexNum]['y'];
                let pz = teamArray[indexNum]['z'];

                

                playerAdvStats[teamArray[indexNum]['name']]['position']['x'] = px;
                playerAdvStats[teamArray[indexNum]['name']]['position']['y'] = py;
                playerAdvStats[teamArray[indexNum]['name']]['position']['z'] = pz;
                playerAdvStats[teamArray[indexNum]['name']]['team'] = color==='blue'?leftTeamName :rightTeamName;
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
        "Pilgrims" : 0,
        "Turkeys":0,
        "Pumkins":0,
        "Death":0,
        "Team Santa":0,
        "Reindeer":0
    };
    /*
   let teams = 
   {
        "RLL":0,
        "belgium" : 0,
        "botswana":0,
        "colombia":0,
        "japan":0,
        "mexico":0,
        "norway":0
    };
    */


    //loop through players
    for(var i = 0; i < team.length; i++)
    {
        teams[PLAYER_TEAM_MAP[team[i]['name'].toUpperCase()]] += 1;
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
                let team = players[i]['team'];

                //Set Team Goal Icon and Colors
                let teamName =  (team === 0 ? leftTeamName : rightTeamName);
                let logo = TEAM_LOGO_MAP[teamName] ;
                let colors = TEAM_COLOR_MAP[teamName];
                let basicColor;
                let barColor;
                if(players[i]['team'] === 0)
                {
                    basicColor = "blue";
                    barColor = "linear-gradient(to right, blue 0%,blue 50%,rgb(134, 134, 255)  100%)";
                }
                else
                {
                    basicColor = "rgba(223, 126, 0, 1)";
                    barColor = "linear-gradient(to right, rgba(223, 126, 0, 1), 0%,rgba(223, 126, 0, 1), 50%,rgb(255, 204, 136) 100%)";
                }

                

                //apply
                $(".targetDisplay img").attr("src", logo);
                $(".targetDisplay .progressBarCont .bar").css({"background" : barColor});

                /*
                $(".targetDisplay").css({"background":colors.primary});
                $(".targetDisplay .scoreTitle").css({"color":colors.secondary});
                $(".targetDisplay .side.speed .text").css({"color":colors.secondary});
                $(".targetDisplay .lowerCont").css({"color":colors.secondary});
                $(".targetDisplay .lowerCont").css({"background":colors.shadow});
                $(".targetDisplay .lowerCont .title").css({"background":colors.primary});
                */

               $(".targetDisplay").css({"background":basicColor});
               $(".targetDisplay .scoreTitle").css({"color":"white"});
               $(".targetDisplay .score").css({"color":"yellow"});
               $(".targetDisplay .side.speed .text").css({"color":"white"});
               $(".targetDisplay .side.speed .middle").css({"color":"yellow"});
               $(".targetDisplay .lowerCont").css({"color":"white"});
               $(".targetDisplay .lowerCont").css({"background":"black"});
               $(".targetDisplay .lowerCont .title").css({"background":basicColor});
                
                
            }
        }

    }
    else
    {
        //hide targetDisplay
        $(".targetDisplay").css({"visibility":"hidden"})
    }
}