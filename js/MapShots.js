function MapShots()
{
    $( ".map" ).empty();
    console.log(playerAdvStats);
    //loop throught arrays
    CreateShots(leftShots, leftTeamName);
    CreateShots(rightShots, rightTeamName);
}

function CreateShots(arr, tm)
{
    let logo = TEAM_LOGO_MAP[tm] ;

    for(let i = 0; i < arr.length; i++)
    {
        let RLX = 4079;
        let RLY = 5103;
        let cssX = 120;
        let cssY = 150;
        let size = 30;
        let yScale = Scale(RLY,cssY,arr[i][1]);
        let xScale = Scale(RLX,cssX,arr[i][0]);
        let top = cssX - xScale - size/2;
        let left = cssY + yScale - size/2;

        

        let apnd = '<img src="' +logo+ '" style="width:' +size+ 'px; height: ' +size+ 'px; position: absolute; top: ' +top+ 'px;left: ' +left+ 'px;"/>';
        $('.map').append(apnd);
    }
}

function LastHit(player)
{
    for (let m in  previousData['players'])
    {
        if(previousData['players'][m]['name'] === player['name'])
        {
            if(player['touches']>previousData['players'][m]['touches'])
            {
                let x = previousData['players'][m]['x'];
                let y = previousData['players'][m]['y'];
                let z = previousData['players'][m]['z'];

                playerAdvStats[player['name']]['lastHit']['x'] = x;
                playerAdvStats[player['name']]['lastHit']['y'] = y;
                playerAdvStats[player['name']]['lastHit']['z'] = z;

            }
        }
    }
}
