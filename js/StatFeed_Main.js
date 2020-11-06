function StatFeedMain(d)
{
    let event = d['type'];
    let player = d['main_target']['name'];
    let target = d['secondary_target']['name'];
    ShowStat(event,player,".blueTeam .players .p1", "blue");
    ShowStat(event,player,".blueTeam .players .p2", "blue");
    ShowStat(event,player,".blueTeam .players .p3", "blue");
    ShowStat(event,player,".orangeTeam .players .p1", "orange");
    ShowStat(event,player,".orangeTeam .players .p2", "orange");
    ShowStat(event,player,".orangeTeam .players .p3", "orange");

    console.log(event);

    if(event === "Goal")
    {
        //save speed
        let curSpd = playerAdvStats[player]['goalSpeed'];
        let ballSpeed = previousData['game']['ballSpeed'];
        if(curSpd < ballSpeed)
        {
            playerAdvStats[player]['goalSpeed'] = ballSpeed;
        }
    }

    if(event === "Demolition")
    {
        playerAdvStats[player]['demos']+=1;
        playerAdvStats[target]['demoed']+=1;
    }
    if(event === "Aerial Goal")
    {
        playerAdvStats[player]['aerialGoals']+=1;
    }
    if(event ==="Epic Save")
    {
        playerAdvStats[player]['epicSaves']+=1;
    }
    if(event ==="Bicycle Hit")
    {
        playerAdvStats[player]['bicycleHits'] += 1;
    }

    
}

function ShowStat(event, player,tile, color)
{
    //check if tile is the goal scorer
    if ($(tile + " .name").text() === player)
    {
        //Add animation class
        $(tile + " .event i").addClass(EVENT_MAP[event]);

        if(event !== "Goal" && event !== "Assist")
        {
            PlayAnimation(tile,'stat_anim',1000);
            
            if(color === "blue")
            {
                PlayAnimation(tile + " .event",'right_slide_anim',8000);
            }
            else
            {
                PlayAnimation(tile + " .event",'left_slide_anim',8000);
            }
            
        }
        if(event === "Goal")
        {
            PlayAnimation(tile,'goal_anim',8000);
        }
        
        if(event === "Assist")
        {
            $(".replay .box.assist").css({"visibility":"visible"});
            $(".replay .assist .name").text(player);
        }
        

        //Clear Icon
        setTimeout(function() {
            $(tile + " .event i").removeClass(EVENT_MAP[event]);
            $(tile).removeClass('stat_anim');
        }, 8000);
    }
}

function SaveShot(player)
{
    //determine which team player is on
    for (let m in  previousData['players'])
    {
        if(previousData['players'][m]['name'] === player)
        {
            console.log(playerAdvStats[player]);
            let tm = previousData['players'][m]['team'] ;
            let coord = [];
            coord[0] = playerAdvStats[player]['lastHit']['x'];
            coord[1] = playerAdvStats[player]['lastHit']['y'];
            coord[2] = playerAdvStats[player]['lastHit']['z'];

            if (tm === 0)
            {
                leftShots.push(coord);
            }
            else
            {
                rightShots.push(coord);
            }
        }
    }
}