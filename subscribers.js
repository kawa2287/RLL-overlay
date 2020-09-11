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
        var blueTeam = [];
        var orangeTeam = [];

        var players = d['players'];

        for (var key of Object.keys(players)) {
            if(players[key].team == 0)
            {
                blueTeam.push(players[key]);
            }
            else
            {
                orangeTeam.push(players[key]);
            }
        }

        //update stats only for actual gameplay
        if(d['game']['ballSpeed'] != 0 && d['game']['isReplay'] == false)
        {
            //Update team time in zone stats
            var curTimeL = parseFloat($(".scorebug .team.left .score").text());
            var curTimeR = parseFloat($(".scorebug .team.right .score").text());
            var percentageFromLeft = 50;

            if(d['game']['ballY'] > 0)
            {
                $(".scorebug .team.left .score").text(curTimeL+0.1);
                UpdateZoneBar(curTimeL,curTimeR);
        
            }
            else if(d['game']['ballY'] < 0)
            {
                $(".scorebug .team.right .score").text(curTimeR+0.1);
                UpdateZoneBar(curTimeL,curTimeR);

            }

            //Update boost stats
            UpdateStats(blueTeam, 0, ".p1","blue");
            UpdateStats(blueTeam, 1, ".p2","blue");
            UpdateStats(blueTeam, 2, ".p3","blue");

            UpdateStats(orangeTeam, 0, ".p1","orange");
            UpdateStats(orangeTeam, 1, ".p2","orange");
            UpdateStats(orangeTeam, 2, ".p3","orange");

        }
     
    })

    WsSubscribers.subscribe("game","replay_will_end", (d) => {
        setTimeout(function() {
            //your code to be executed after 1 second
            document.getElementById('hidden-checkbox').click();
             console.log(d)
          }, 1000);
        
    })
    WsSubscribers.subscribe("game","replay_end", (d) => {
        document.getElementById('hidden-checkbox').click();
        console.log(d)
    })
})

function UpdateStats(teamArray, indexNum, p, color)
{

    var q = (color == "blue" ? ".blueTeam " : ".orangeTeam ") + p;

    
    if(teamArray[indexNum] != undefined)
    {
        //Boost
        $(q + " .name").text(teamArray[indexNum]['name']);
        $(q + " .boost").text(teamArray[indexNum]['boost']+"%");
        progress(teamArray[indexNum]['boost'], $(q+ " .bar"));

        //Score
        $(q + " .score").text(teamArray[indexNum]['score']);
        
        //Touches
        $(q + " .touches").text(teamArray[indexNum]['touches']);

        //Car Bumps
        $(q + " .carBumps").text(teamArray[indexNum]['cartouches']);
    
    }
    else
    {
        $(q).css({"visibility":"hidden" });
    }
};

function UpdateZoneBar(lTime,rTime)
{
    //Update Bar
    var val = 100*lTime/(lTime+rTime)
    $(".t-in-zone .fill-from-left").css({"width":val+"%"});
    //Update percentages
    $(".leftpressure").text(Math.round(100*lTime/(lTime+rTime))+"%");
    $(".rightpressure").text(Math.round(100*rTime/(lTime+rTime))+"%");

};

function progress(percent, $element) {
    $element.css({ width: percent +"%" });

}




