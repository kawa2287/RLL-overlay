function MapPositions(d)
{
    //clear
    $( ".map" ).empty();

    //set givens
    let RLX = 4079;
    let RLY = 5103;
    let RLZ = 2500;
    let cssX = 120;
    let cssY = 150;
    let size = 25;

    for (var p of Object.keys(playerAdvStats)) 
    {
        let logo = TEAM_LOGO_MAP[playerAdvStats[p]['team']] ;

        
        let x = playerAdvStats[p]['position']['x'];
        let y = playerAdvStats[p]['position']['y'];
        let z = playerAdvStats[p]['position']['z'];
        let yScale = Scale(RLY,cssY,y);
        let xScale = Scale(RLX,cssX,x);
        let top = cssX - xScale - size/2;
        let left = cssY + yScale - size/2;
        size = (1+z/RLZ)*size


        let apnd = '<img src="' +logo+ '" style="width:' +size+ 'px; height: ' +size+ 'px; position: absolute; top: ' +top+ 'px;left: ' +left+ 'px;"/>';
        $('.map').append(apnd);
    }

    let ball = "assets/ball.png" ;
        
    let xb = d['game']['ballX'];
    let yb = d['game']['ballY'];
    let zb = d['game']['ballZ'];
    let yScaleb = Scale(RLY,cssY,yb);
    let xScaleb = Scale(RLX,cssX,xb);
    let topb = cssX - xScaleb - size/2;
    let leftb = cssY + yScaleb - size/2;
    let bsize = 25;
    bsize = (1+zb/RLZ)*bsize


    let bapnd = '<img src="' +ball+ '" style="width:' +bsize+ 'px; height: ' +bsize+ 'px; position: absolute; top: ' +topb+ 'px;left: ' +leftb+ 'px;"/>';
    $('.map').append(bapnd);
}