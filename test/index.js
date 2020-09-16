const WebSocket = require('ws');
const fs = require('fs');

const PORT = 49322;

const wss = new WebSocket.Server({ port: PORT });
let connections = {};

//a wsClient for sending fake RL/BM messages
const wsClient = new WebSocket("ws://localhost:" + PORT);
/**
 * this interval is for the gamestate messages
 * 
 * NOTE: call clearInterval on the intervals in ws.on('close'... below
 */
const gsInterval = setInterval(() => {
    const gamestate = JSON.parse(fs.readFileSync('update_state-sample.json', 'utf-8'));
    const gamestateMsg = JSON.stringify({
        event: 'game:update_state',
        data: gamestate
    });
    wsClient.send(gamestateMsg);
    // console.log(gamestate);
    console.log('sent gamestate');
}, 2000);


/**
 * below here is ws-relay but without the RL/BM hooks
 * it should just provide a WS server that relays messages
 */
wss.on('connection', function connection(ws) {
    console.log('WSS init');
    let id = (+ new Date()).toString();
    console.log("Received connection: " + id);
    connections[id] = {
        connection: ws,
        registeredFunctions: []
    };

    ws.send(JSON.stringify({
        event: "wsRelay:info",
        data: "Connected!"
    }));

    ws.on('message', function incoming(message) {
        sendRelayMessage(id, message);
    });

    ws.on('close', function close() {
        // Might run into race conditions with accessing connections for sending, but cant be arsed to account for this.
        // If a connection closes something will be fucked anyway
        delete connections[id];
        
        clearInterval(gsInterval);
    });
});

function sendRelayMessage(senderConnectionId, message) {
    let json = JSON.parse(message);
    console.log(senderConnectionId + "> Sent " + json.event);
    let channelEvent = (json['event']).split(':');
    if (channelEvent[0] === 'wsRelay') {
        if (channelEvent[1] === 'register') {
            if (connections[senderConnectionId].registeredFunctions.indexOf(json['data']) < 0) {
                connections[senderConnectionId].registeredFunctions.push(json['data']);
                console.log(senderConnectionId + "> Registered to receive: "+json['data']);
            } else {
                console.log(senderConnectionId + "> Attempted to register an already registered function: "+json['data']);
            }
        } else if (channelEvent[1] === 'unregister') {
            let idx = connections[senderConnectionId].registeredFunctions.indexOf(json['data']);
            if (idx > -1) {
                connections[senderConnectionId].registeredFunctions.splice(idx, 1);
                console.log(senderConnectionId + "> Unregistered: "+json['data']);
            } else {
                console.log(senderConnectionId + "> Attempted to unregister a non-registered function: "+json['data']);
            }
        }
        return;
    }
    for (let k in connections) {
        if (senderConnectionId === k) {
            continue;
        }
        if (!connections.hasOwnProperty(k)) {
            continue;
        }
        if (connections[k].registeredFunctions.indexOf(json['event']) > -1) {
            setTimeout(() => {
                try {
                    connections[k].connection.send(message);
                } catch (e) {
                    //The connection can close between the exist check, and sending, so we catch it here and ignore
                }
            }, 0);
        }
    }
}