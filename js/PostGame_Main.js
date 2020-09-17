function PostGameMain()
{
    //show post game scores
    $(".postGame .left.team").css({"transform":"translateX(960px)"})
    $(".postGame .right.team").css({"transform":"translateX(-960px)"})

    //Fill out stats
    for (let n = 0; n <= 1; n++)
    {
        //set side
        let side = (n===0 ? ".left.team" : ".right.team")

        //set score
        $(".postGame " + side +" .tmscore").text(previousData['game']['teams'][n]['score']);

        let counter = 0;
        for(let i = 0; i < globPlayerTmsArr.length; i++)
        {

            if(globPlayerTmsArr[i][0]['team']===n)
            {
                //set player
                counter += 1;
                let x = '.p' + counter;
                console.log(globPlayerTmsArr[i][0]);

                //set search
                let q = ".postGame "+ side + " .postDisplay"+x;

                //set stats
                let pts = globPlayerTmsArr[i][0]['goals'] + globPlayerTmsArr[i][0]['assists']; 
                $(q +" .player .name").text(globPlayerTmsArr[i][0]['name']);
                $(q +" .player .score").text(globPlayerTmsArr[i][0]['score']);
                $(q +" .player .stat.points .value").text(pts);
                $(q +" .player .stat.goals .value").text(globPlayerTmsArr[i][0]['goals']);
                $(q +" .player .stat.assists .value").text(globPlayerTmsArr[i][0]['assists']);
                $(q +" .player .stat.shots .value").text(globPlayerTmsArr[i][0]['shots']);
                $(q +" .player .stat.saves .value").text(globPlayerTmsArr[i][0]['saves']);
                $(q +" .player .stat.touches .value").text(globPlayerTmsArr[i][0]['touches']);
                $(q +" .player .stat.bumps .value").text(globPlayerTmsArr[i][0]['cartouches']);
                
                
                //set colors and logos
                let team = globPlayerTmsArr[i][0]['team'];

                //Set Team Goal Icon and Colors
                let teamName =  (team === 0 ? leftTeamName : rightTeamName);
                let logo = TEAM_LOGO_MAP[teamName] ;
                let colors = TEAM_COLOR_MAP[teamName];
            

                //apply
                $(".postGame "+side+ " .upperArea img").attr("src", logo);
                $(".postGame "+side).css({"background-image":"linear-gradient(to top,grey , "+colors.primary+")"});

                $(q +" img").attr("src", logo);
                $(q).css({"background":colors.primary});
                $(q +" .scoreTitle").css({"color":colors.secondary});
                $(q +" .lowerCont").css({"color":colors.secondary});
                $(q +" .lowerCont").css({"background":colors.shadow});
                $(q +" .lowerCont .title").css({"background":colors.primary});
               
            }
        }
    }
}