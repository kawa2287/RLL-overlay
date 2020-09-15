function GoalScoredMain(d)
{
    //Determine which team scored
    let gScoringTm = DetermineGoalScoringTeam(d['scorer']['name']);
    let scoredAgainst = (gScoringTm === 'blue' ? 'orange' : 'blue');

    //Set Team Goal Icon and Colors
    let teamName =  (gScoringTm === 'blue' ? leftTeamName : rightTeamName);
    let oppName = (scoredAgainst === 'blue' ? leftTeamName : rightTeamName);
    let logo = TEAM_LOGO_MAP[teamName] ;
    let oppLogo = TEAM_LOGO_MAP[oppName] ;
    let colors = TEAM_COLOR_MAP[teamName];
    let oppColors = TEAM_COLOR_MAP[oppName];
    $(".scorebug .overlay .i img").attr("src", logo);
    $(".scorebug .overlay").css({"background": colors.primary});
    $(".scorebug .overlay .g").css({"color":colors.secondary});
    $(".scorebug .overlay .g").css({"text-shadow":"2px 2px 6px "+colors.shadow});

    //Flash Scoreboard Goal Animation
    FlashGoal();

    //Set Scorer
    $(".replay .scorer img").attr("src", logo);
    $(".replay .scorer .name").text(d['scorer']['name']);
    $(".replay .scorer .h").css({"background":colors.primary});
    $(".replay .scorer .name").css({"color":colors.secondary});
    $(".replay .scorer .name").css({"text-shadow":"2px 2px 8px "+ colors.shadow});

    //set assister
    $(".replay .box.assist").css({"visibility":"hidden"});
    $(".replay .assist img").attr("src", logo);
    $(".replay .assist .name").text('Unassisted');
    $(".replay .assist .h").css({"background":colors.primary});
    $(".replay .assist .name").css({"color":colors.secondary});
    $(".replay .assist .name").css({"text-shadow":"2px 2px 8px "+ colors.shadow});

    //Determine Last Man Back
    let lastMan = GetLastManBack(previousData,scoredAgainst);
    let lManName = (lastMan===undefined? 'undetermined':lastMan['name']);
    $(".replay .lastMan img").attr("src", oppLogo);
    $(".replay .lastMan .name").text(lManName);
    $(".replay .lastMan .h").css({"background":oppColors.primary});
    $(".replay .lastMan .name").css({"color":oppColors.secondary});
    $(".replay .lastMan .name").css({"text-shadow":"2px 2px 8px "+ oppColors.shadow});

    //Determine where on net the goal was
    GetGoalNetPosition(previousData,scoredAgainst);

}

function GetGoalNetPosition(d, scoredOn)
{
    //divDim is how big the div is that holds the image (anchor is top left)
    let ball = GetBallInfo(d);
    let divDim = 30;
    let rlW = 800;
    let rlH = 440;
    let cssW = 100;
    let cssH = 75;

    console.log("BALLX= " + ball.x + " BALLZ= " + ball.z + " SPEED = " +ball.speed)
    let xScaled = Scale(rlW,cssW,ball.x);
    let zScaled = Scale(rlH,cssH, ball.z );

    let xTrans = 0;
    let zTrans = 0;
    //check field positioning
    if(scoredOn === 'blue')
    {
        if(ball.x >=0)
        {
            xTrans = cssW + Math.abs(xScaled) -divDim/2;
        }
        else
        {
            xTrans = cssW-Math.abs(xScaled) -divDim/2;
        }
    }
    else
    {
        if(ball.x <=0)
        {
            xTrans = cssW + Math.abs(xScaled) -divDim/2;
        }
        else
        {
            xTrans = cssW-Math.abs(xScaled) -divDim/2;
        }
    }
    zTrans = (cssH-divDim/2) - zScaled - divDim/2 + Scale(rlH,cssH,96 );

    console.log(xTrans);
    console.log(zTrans);
    
    //set position
    $(".replay .goal .in b").css({"transform": "translate("+ xTrans +"px,"+ zTrans +"px)"});
    $(".replay .goal .in i").css({"transform": "translate("+ xTrans +"px,"+ zTrans +"px)"});
    $(".replay .speed").text(ball.speed+" MPH");


}

function Scale(rlScale, cssScale, value)
{
    return Math.floor((cssScale/rlScale)*value);
}


function DetermineGoalScoringTeam(scorer)
{   
    for(var i = 0; i < globPlayerTmsArr.length; i ++ )
    {
        if(scorer=== globPlayerTmsArr[i][0]['name'])
        {
            return globPlayerTmsArr[i][1];
        }
    }
    return 'unknown';
}

function GetLastManBack(d,teamColor)
{
    //function to determine closest player to ball when scored on
    let playerTeamArray = GetPlayerTeamArray(d);
    let ballInfo = GetBallInfo(d);
    let closestPlayer = 'UNDEFINED';
    let minDist = -1;

    //Loop through players
    for(var i = 0; i<playerTeamArray.length; i++)
    {
        //Check team that was scored on
        if(teamColor === playerTeamArray[i][1])
        {
            //get player info
            let playerInfo = GetPlayerInfo(playerTeamArray[i][0]);

            //Get distance
            let dist = GetDistanceFromBall(ballInfo,playerInfo);

            //check if player is closest
            if (minDist === -1)
            {
                closestPlayer = playerTeamArray[i][0];
                minDist = dist;
            }
            else
            {
                if(dist < minDist)
                {
                    minDist = dist;
                    closestPlayer = playerTeamArray[i][0];
                }
            }
        } 
    }

    return closestPlayer;
}

function GetBallInfo(d)
{
    let ball = {
        x:d['game']['ballX'],
        y:d['game']['ballY'],
        z:d['game']['ballZ'],
        speed:Math.ceil(d['game']['ballSpeed']*0.621371)
    }
    return ball;
}

function GetPlayerInfo(p)
{
    let player = {
        x:p['x'],
        y:p['y'],
        z:p['z'],
        speed:p['speed']
    }
    return player;
}
function GetDistanceFromBall(ball, player)
{
    let deltaX = ball.x - player.x;
    let deltaY = ball.y - player.y;
    let deltaZ = ball.z - player.z;

    return Math.pow(Math.pow(deltaX,2)+Math.pow(deltaY,2)+Math.pow(deltaZ,2),0.5);
}

function FlashGoal(){

    let q = ".scorebug .overlay";

    PlayAnimation(q,'scoreboard_goal_anim',8000);
    PlayAnimation(q + ' .g','scoreboard_goal_text',8000);
    PlayAnimation(q + ' .i','scoreboard_goal_img',8000);
      
}