const WebSocket = require("ws");
const fs = require("fs");

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

//--------------------------------------------------------------------------------
// Game events
// + event: "game:match_created"   | data: "game_match_created"                    [Lobby view]
// + event: "game:initialized"     | data: "initialized"                           [When first player enters the match]
// + event: "game:update_state"    | data:  parse("update_state-sample.json")      [General info sent every 0.1s]
// + event: "game:statfeed_event"  | data:  parse("statefeed_event-sample.json")   [goal/shot/save/bicycle/demo... etc]
// + event: "game:goal_scored"     | data:  parse("goal_scored-sample.json")       [info of who scored the goal]
// + event: "game:replay_start"    | data: "game_replay_start"                     [Start of the replay of the goal]
// + event: "game:replay_will_end" | data: "game_replay_will_end"                  [Lead time before the replay ends]
// + event: "game:replay_end"      | data: "game_replay_end"                       [End of the replay]
// + event: "game:podium_start"    | data: "game_podium_start"                     [End of game, this is when the cars dance]
//---------------------------------------------------------------------------------
const gamestateInterval = 1000; // milliseconds
let timeCounter = gamestateInterval / 1000; // seconds
const gsInterval = setInterval(() => {
  let gamestate = JSON.parse(
    fs.readFileSync("update_state-sample.json", "utf-8")
  );

  // do some modifications
  // GAME TIME
  gamestate.game.time += timeCounter;
  timeCounter += gamestateInterval / 1000;

  // BALL POSITIONING
  const x = Math.random() * 7000 - 3500; // random number between -3500 and 3500
  const y = Math.random() * 10000 - 5000; // random number between -5000 and 5000
  gamestate.game.ballX = x;
  gamestate.game.ballY = y;

  // PLAYER SCORES / BOOSTS / x/y/z
  gamestate.players = Object.keys(gamestate.players).map((playerName) => {
    const player = gamestate.players[playerName];
    const newScore = Math.floor(Math.random() * 1000);
    const newBoost = Math.random() * 100;
    const newSpeed = Math.random() * 100;

    player.score = newScore;
    player.boost = newBoost;
    player.speed = newSpeed;

    return player;
  });

  // console.log(gamestate.players);

  const gamestateMsg = JSON.stringify({
    event: "game:update_state",
    data: gamestate,
  });
  wsClient.send(gamestateMsg);
  // console.log(gamestate);
  console.log("sent gamestate");
}, gamestateInterval);

/**
 * TODO: handle other types of messages
 *
 * idea 1: create a new interval for each type
 * idea 2: one interval at smallest period with counters for others to track when to go
 *
 * 'game:update_state',     100ms
 * 'game:goal_scored',      random interval
 * 'game:statfeed_event',   10sec?
 * 'game:replay_start',     right after goal_scored
 * 'game:replay_will_end',  ~10sec after replay_start
 * 'game:replay_end'        ~1sec after replay_will_end
 *
 */

/**
 * below here is ws-relay but without the RL/BM hooks
 * it should just provide a WS server that relays messages
 */
wss.on("connection", function connection(ws) {
  console.log("WSS init");
  let id = (+new Date()).toString();
  console.log("Received connection: " + id);
  connections[id] = {
    connection: ws,
    registeredFunctions: [],
  };

  ws.send(
    JSON.stringify({
      event: "wsRelay:info",
      data: "Connected!",
    })
  );

  ws.on("message", function incoming(message) {
    sendRelayMessage(id, message);
  });

  ws.on("close", function close() {
    // Might run into race conditions with accessing connections for sending, but cant be arsed to account for this.
    // If a connection closes something will be fucked anyway
    delete connections[id];

    clearInterval(gsInterval);
  });
});

function sendRelayMessage(senderConnectionId, message) {
  let json = JSON.parse(message);
  console.log(senderConnectionId + "> Sent " + json.event);
  let channelEvent = json["event"].split(":");
  if (channelEvent[0] === "wsRelay") {
    if (channelEvent[1] === "register") {
      if (
        connections[senderConnectionId].registeredFunctions.indexOf(
          json["data"]
        ) < 0
      ) {
        connections[senderConnectionId].registeredFunctions.push(json["data"]);
        console.log(
          senderConnectionId + "> Registered to receive: " + json["data"]
        );
      } else {
        console.log(
          senderConnectionId +
            "> Attempted to register an already registered function: " +
            json["data"]
        );
      }
    } else if (channelEvent[1] === "unregister") {
      let idx = connections[senderConnectionId].registeredFunctions.indexOf(
        json["data"]
      );
      if (idx > -1) {
        connections[senderConnectionId].registeredFunctions.splice(idx, 1);
        console.log(senderConnectionId + "> Unregistered: " + json["data"]);
      } else {
        console.log(
          senderConnectionId +
            "> Attempted to unregister a non-registered function: " +
            json["data"]
        );
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
    if (connections[k].registeredFunctions.indexOf(json["event"]) > -1) {
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
