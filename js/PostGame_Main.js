function PostGameMain()
{
    //show post game scores
    $(".postGame .left.team").css({"transform":"translateX(960px)"})
    $(".postGame .right.team").css({"transform":"translateX(-960px)"})

    //Sort Players Array
    //push to sorting array
    let sortList = [];
    for (var p in globPlayerTmsArr) 
    {
        sortList.push([globPlayerTmsArr[p][0],globPlayerTmsArr[p][0]['score']]);
    }

    //sort
    sortList.sort(function(a, b) {
        return b[1] - a[1];
    });

    console.log("-----------");
    console.log(sortList);

    //Fill out stats
    for (let n = 0; n <= 1; n++)
    {
        //set side
        let side = (n===0 ? ".left.team" : ".right.team")

        //set score
        $(".postGame " + side +" .tmscore").text(previousData['game']['teams'][n]['score']);

        let counter = 0;
        for(let i = 0; i < sortList.length; i++)
        {

            if(sortList[i][0]['team']===n)
            {
                //set player
                counter += 1;
                let x = '.p' + counter;

                //set search
                let q = ".postGame "+ side + " .postDisplay"+x;
                console.log(sortList);
                let aTime = playerAdvStats[sortList[i][0]['name']]['airTime'];


                //set stats
                let pts = sortList[i][0]['goals'] + sortList[i][0]['assists']; 
                $(q +" .player .name").text(sortList[i][0]['name']);
                $(q +" .player .score").text(sortList[i][0]['score']);
                $(q +" .player .stat.points .value").text(pts);
                $(q +" .player .stat.goals .value").text(sortList[i][0]['goals']);
                $(q +" .player .stat.assists .value").text(sortList[i][0]['assists']);
                $(q +" .player .stat.shots .value").text(sortList[i][0]['shots']);
                $(q +" .player .stat.saves .value").text(sortList[i][0]['saves']);
                $(q +" .player .stat.touches .value").text(sortList[i][0]['touches']);
                $(q +" .player .stat.bumps .value").text(sortList[i][0]['cartouches']);
                $(q +" .player .stat.airTime .value").text(aTime.toFixed(2));
                $(q +" .player .stat.airHits .value").text(playerAdvStats[sortList[i][0]['name']]['airHits']);
                
                
                //set colors and logos
                let team = sortList[i][0]['team'];

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