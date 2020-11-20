function StatFeedMain(d)
{
    let event = d['type'];
    let player = d['main_target']['name'];
    let target = d['secondary_target']['name'];

    console.log(event);
    let side ="";
    let selector= "";


    //determine which team player is on
    for (let m in  previousData['players'])
    {
        if(previousData['players'][m]['name'] === player)
        {
            let tm = previousData['players'][m]['team'] ;
            
            if (tm === 0)
            {
                side ="left";
                selector="toast-left"
            }
            else
            {
                side ="right";
                selector="toast-right"
            }
        }
    }

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

    if(event === "Shot on Goal")
    {
        Toastify({
            text: "SHOT | "+player,
            duration: 5000, 
            destination: "https://github.com/apvarun/toastify-js",
            backgroundColor: "RED",
            close: false,
            selector:selector,
            avatar: "assets/ICON_SHOT.png",
            gravity: "top", // `top` or `bottom`
            position: side, // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            
            onClick: function(){} // Callback after click
          }).showToast();
    }

    if(event === "Save")
    {
        Toastify({
            text: "SAVE | "+player,
            duration: 5000, 
            destination: "https://github.com/apvarun/toastify-js",
            backgroundColor: "BLUE",
            close: false,
            selector:selector,
            avatar: "assets/ICON_SHOT.png",
            gravity: "top", // `top` or `bottom`
            position: side, // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            
            onClick: function(){} // Callback after click
          }).showToast();
    }

    

    if(event === "Demolition")
    {
        playerAdvStats[player]['demos']+=1;
        playerAdvStats[target]['demoed']+=1;
        Toastify({
            text: "DEMO | "+player,
            duration: 5000, 
            destination: "https://github.com/apvarun/toastify-js",
            backgroundColor: "BLACK",
            close: false,
            selector:selector,
            avatar: "assets/ICON_DEMO.png",
            gravity: "top", // `top` or `bottom`
            position: side, // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            
            onClick: function(){} // Callback after click
          }).showToast();
    }
    if(event === "Aerial Goal")
    {
        playerAdvStats[player]['aerialGoals']+=1;
        Toastify({
            text: "AERIAL | "+player,
            duration: 5000, 
            destination: "https://github.com/apvarun/toastify-js",
            backgroundColor: "CHOCOLATE",
            close: false,
            selector:selector,
            avatar: "assets/ICON_DEMO.png",
            gravity: "top", // `top` or `bottom`
            position: side, // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            
            onClick: function(){} // Callback after click
          }).showToast();
        
    }
    if(event ==="Epic Save")
    {
        playerAdvStats[player]['epicSaves']+=1;
        Toastify({
            text: "EPIC SAVE | "+player,
            duration: 5000, 
            destination: "https://github.com/apvarun/toastify-js",
            backgroundColor: "PURPLE",
            close: false,
            selector:selector,
            avatar: "assets/ICON_EPIC.png",
            gravity: "top", // `top` or `bottom`
            position: side, // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            
            onClick: function(){} // Callback after click
          }).showToast();
    }
    if(event ==="Bicycle Hit")
    {
        playerAdvStats[player]['bicycleHits'] += 1;
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