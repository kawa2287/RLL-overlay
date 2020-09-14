function StatFeedMain(d)
{
    let event = d['type'];
        let player = d['main_target']['name'];
        ShowStat(event,player,".blueTeam .players .p1", "blue");
        ShowStat(event,player,".blueTeam .players .p2", "blue");
        ShowStat(event,player,".blueTeam .players .p3", "blue");
        ShowStat(event,player,".orangeTeam .players .p1", "orange");
        ShowStat(event,player,".orangeTeam .players .p2", "orange");
        ShowStat(event,player,".orangeTeam .players .p3", "orange");
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
        /*
        if(event === "Assist")
        {
            let gScoringTm = DetermineGoalScoringTeam(player);
            let teamName =  (gScoringTm === 'blue' ? leftTeamName : rightTeamName);
            let logo = TEAM_LOGO_MAP[teamName] ;
            let colors = TEAM_COLOR_MAP[teamName];
            $(".replay .assist img").attr("src", logo);
            $(".replay .assist .name").text(player);
            $(".replay .assist .name").css({"background":colors.primary});
            $(".replay .assist .name").css({"color":colors.secondary});
            $(".replay .assist .name").css({"text-shadow":"2px 2px 8px "+ colors.shadow});
        }
        */

        //Clear Icon
        setTimeout(function() {
            $(tile + " .event i").removeClass(EVENT_MAP[event]);
            $(tile).removeClass('stat_anim');
        }, 8000);
    }
}