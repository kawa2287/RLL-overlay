function MatchCreatedMain()
{
    //make sure postgame is gone
    $(".postGame .left.team").css({"transform":"translateX(0px)"})
    $(".postGame .right.team").css({"transform":"translateX(0px)"})

    console.log("init");

    //Clear player adv stats
    for (let p in playerAdvStats) 
    {
        delete playerAdvStats[p];
    }

    //Clear Shots
    leftShots = [];
    rightShots = [];
}