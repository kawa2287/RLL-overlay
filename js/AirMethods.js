function AirStats(player)
{
    //check if player is in air
    if(IsInAir(player))
    {
        playerAdvStats[player['name']]['airTime'] += 0.1;
        AirHit(player);
    }


}


function IsInAir(player)
{
    let minX = -3500; //3500
    let maxX = 3500;  //3500
    let minY = -4600; //4600
    let maxY = 4600;  //4600
    let zReq = 400;  //500
    let x = player['x'];
    let y = player['y'];
    let z = player['z'];

    if(x>minX && x <maxX && y> minY && y<maxY && z > zReq)
    {
        return true;
    }

    return false;
}

function AirHit(player)
{
    for (let m in  previousData['players'])
    {
        if(previousData['players'][m]['name'] === player['name'])
        {
            if(player['touches']>previousData['players'][m]['touches'])
            {
                playerAdvStats[player['name']]['airHits'] += 1;
            }
        }
    }
}

