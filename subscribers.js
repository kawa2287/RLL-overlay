


const WsSubscribers = {
    __subscribers: {},
    websocket: undefined,
    webSocketConnected: false,
    registerQueue: [],
    init: function(port, debug, debugFilters) {
        port = port || 49322;
        debug = debug || false;
        if (debug) {
            if (debugFilters !== undefined) {
                console.warn("WebSocket Debug Mode enabled with filtering. Only events not in the filter list will be dumped");
            } else {
                console.warn("WebSocket Debug Mode enabled without filters applied. All events will be dumped to console");
                console.warn("To use filters, pass in an array of 'channel:event' strings to the second parameter of the init function");
            }
        }
        WsSubscribers.webSocket = new WebSocket("ws://localhost:" + port);
        WsSubscribers.webSocket.onmessage = function (event) {
            let jEvent = JSON.parse(event.data);
            if (!jEvent.hasOwnProperty('event')) {
                return;
            }
            let eventSplit = jEvent.event.split(':');
            let channel = eventSplit[0];
            let event_event = eventSplit[1];
            if (debug) {
                if (!debugFilters) {
                    console.log(channel, event_event, jEvent);
                } else if (debugFilters && debugFilters.indexOf(jEvent.event) < 0) {
                    console.log(channel, event_event, jEvent);
                }
            }
            WsSubscribers.triggerSubscribers(channel, event_event, jEvent.data);
        };
        WsSubscribers.webSocket.onopen = function () {
            WsSubscribers.triggerSubscribers("ws", "open");
            WsSubscribers.webSocketConnected = true;
            WsSubscribers.registerQueue.forEach((r) => {
                WsSubscribers.send("wsRelay", "register", r);
            });
            WsSubscribers.registerQueue = [];
        };
        WsSubscribers.webSocket.onerror = function () {
            WsSubscribers.triggerSubscribers("ws", "error");
            WsSubscribers.webSocketConnected = false;
        };
        WsSubscribers.webSocket.onclose = function () {
            WsSubscribers.triggerSubscribers("ws", "close");
            WsSubscribers.webSocketConnected = false;
        };
    },
    /**
     * Add callbacks for when certain events are thrown
     * Execution is guaranteed to be in First In First Out order
     * @param channels
     * @param events
     * @param callback
     */
    subscribe: function(channels, events, callback) {
        if (typeof channels === "string") {
            let channel = channels;
            channels = [];
            channels.push(channel);
        }
        if (typeof events === "string") {
            let event = events;
            events = [];
            events.push(event);
        }
        channels.forEach(function(c) {
            events.forEach(function (e) {
                if (!WsSubscribers.__subscribers.hasOwnProperty(c)) {
                    WsSubscribers.__subscribers[c] = {};
                }
                if (!WsSubscribers.__subscribers[c].hasOwnProperty(e)) {
                    WsSubscribers.__subscribers[c][e] = [];
                    if (WsSubscribers.webSocketConnected) {
                        WsSubscribers.send("wsRelay", "register", `${c}:${e}`);
                    } else {
                        WsSubscribers.registerQueue.push(`${c}:${e}`);
                    }
                }
                WsSubscribers.__subscribers[c][e].push(callback);
            });
        })
    },
    clearEventCallbacks: function (channel, event) {
        if (WsSubscribers.__subscribers.hasOwnProperty(channel) && WsSubscribers.__subscribers[channel].hasOwnProperty(event)) {
            WsSubscribers.__subscribers[channel] = {};
        }
    },
    triggerSubscribers: function (channel, event, data) {
        if (WsSubscribers.__subscribers.hasOwnProperty(channel) && WsSubscribers.__subscribers[channel].hasOwnProperty(event)) {
            WsSubscribers.__subscribers[channel][event].forEach(function(callback) {
                if (callback instanceof Function) {
                    callback(data);
                }
            });
        }
    },
    send: function (channel, event, data) {
        if (typeof channel !== 'string') {
            console.error("Channel must be a string");
            return;
        }
        if (typeof event !== 'string') {
            console.error("Event must be a string");
            return;
        }
        if (channel === 'local') {
            this.triggerSubscribers(channel, event, data);
        } else {
            let cEvent = channel + ":" + event;
            WsSubscribers.webSocket.send(JSON.stringify({
                'event': cEvent,
                'data': data
            }));
        }
    }
};

///
$(() => {
    WsSubscribers.init(49322,true);
    WsSubscribers.subscribe("game","update_state", (d) => {
        
        //Check if not replay
        
        //store team info
        let blueTeam = [];
        let orangeTeam = [];

        let players = d['players'];

        for (var key of Object.keys(players)) {
            if(players[key].team === 0)
            {
                blueTeam.push(players[key]);
            }
            else
            {
                orangeTeam.push(players[key]);
            }
        }

        //Update Time
        $(".scorebug .rightcontainer").text(secondsToMS(d['game']['time']));

        //Update Score
        $(".scorebug .team.left .score").text(d['game']['teams'][0]['score'] );
        $(".scorebug .team.right .score").text(d['game']['teams'][1]['score'] );

        //Update Stats
        let isReplay = d['game']['isReplay'];

        UpdateStats(blueTeam, 0, ".p1","blue",isReplay);
        UpdateStats(blueTeam, 1, ".p2","blue",isReplay);
        UpdateStats(blueTeam, 2, ".p3","blue",isReplay);

        UpdateStats(orangeTeam, 0, ".p1","orange",isReplay);
        UpdateStats(orangeTeam, 1, ".p2","orange",isReplay);
        UpdateStats(orangeTeam, 2, ".p3","orange",isReplay);
        
        //Determine Team & Logo
        let leftTeamName = GetTeam(blueTeam)
        let rightTeamName = GetTeam(orangeTeam)
        
        $(".scorebug .left .name").text(leftTeamName);
        $(".scorebug .right .name").text(rightTeamName);
        $(".scorebug .left .logo img").attr("src",TEAM_BANNER_MAP[leftTeamName]);
        $(".scorebug .right .logo img").attr("src",TEAM_BANNER_MAP[rightTeamName]);


    })

    WsSubscribers.subscribe("game", "replay_will_end", (d) => {
        setTimeout(function() {
            $('#transitionLogo').removeClass('animate__rollOut');
            $('#transitionLogo').addClass('animate__rollIn');
            $('#transitionBg').addClass('hasBg');
            $('#transitionBg').removeClass('animate__fadeOut');
            $('#transitionBg').addClass('animate__fadeIn');
            //your code to be executed after 1 second
            // document.getElementById('hidden-checkbox').click();
            console.log(d);
          }, 1000);
        
    })
    WsSubscribers.subscribe("game", "replay_end", (d) => {
        $('#transitionLogo').removeClass('animate__rollIn');
        $('#transitionLogo').addClass('animate__rollOut');
        $('#transitionBg').removeClass('animate__fadeIn');
        $('#transitionBg').addClass('animate__fadeOut');
        $('#transitionBg').removeClass('hasBg');
        // document.getElementById('hidden-checkbox').click();
        console.log(d);
    })
})

function CheckDead(teamArray,color)
{


}

function secondsToMS(d) 
{
    d = Math.ceil(Number(d));
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var mDisplay = m ;
    var sDisplay = (s < 10 ? "0" : "") + s;
    return mDisplay +":"+ sDisplay; 
}



function UpdateStats(teamArray, indexNum, p, color, isReplay)
{
    const q = `.${color}Team ${p}`;

    
    if(teamArray[indexNum] !== undefined)
    {
        $(q).css({"visibility":"visible" });

        //Boost
        if(!isReplay)
        {
            $(q + " .name").text(teamArray[indexNum]['name']);
            $(q + " .boost").text(teamArray[indexNum]['boost']+"%");
            progress(teamArray[indexNum]['boost'], $(q+ " .bar"));
        }

        //Score
        $(q + " .score").text(teamArray[indexNum]['score']);

        //Goals
        $(q + " .goals").text(teamArray[indexNum]['goals']);

        //Touches
        $(q + " .touches").text(teamArray[indexNum]['touches']);

        //Car Bumps
        $(q + " .carBumps").text(teamArray[indexNum]['cartouches']);
        
        // Demos
        $(q + " .numDemos").text(teamArray[indexNum]['demos']);

        //Check if Dead
        if(teamArray[indexNum]['isDead'])
        {
            $(q).css({"opacity":.5});
        }
        else
        {
            $(q).css({"opacity":1});
        }
    
    }
    else
    {
        $(q).css({"visibility":"hidden" });
    }
};

function UpdateZoneBar(lTime,rTime)
{
    //Update Bar
    let val = 100 * lTime / (lTime + rTime)
    $(".t-in-zone .fill-from-left").css({"width":val+"%"});
    //Update percentages
    $(".leftpressure").text(Math.round(100*lTime/(lTime+rTime))+"%");
    $(".rightpressure").text(Math.round(100*rTime/(lTime+rTime))+"%");

};

function progress(percent, $element) {
    $element.css({ width: percent +"%" });

}

function GetTeam(team)
{
    //initial object
    let teams = 
    {
        "RLL":0,
        "Crabs" : 0,
        "Knights":0,
        "Pigeons":0,
        "Queens":0,
        "LongBows":0,
        "Samurai":0
    };

    //loop through players
    for(var i = 0; i < team.length; i++)
    {
        teams[PLAYER_TEAM_MAP[team[i]['name']]] += 1;
    }

    //push to sortable array
    var sortList = [];
    for (var team in teams) {
        sortList.push([team, teams[team]]);
    }

    //sort
    sortList.sort(function(a, b) {
        return b[1] - a[1];
    });

    //return
    return sortList[0][0];
}



