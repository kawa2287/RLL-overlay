const WebSocket = require("ws");
const fs = require("fs");
const PMAP = require("./playermap-test");

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

//Generate random Players
let randPlayers = [];
randPlayers = GenerateRandomPlayers();
console.log(randPlayers);

const gsInterval = setInterval(() => {
  //GAMESTATE
  //----------------------------------------------------------------------------------
  let gamestate = JSON.parse(
    fs.readFileSync("update_state-sample.json", "utf-8")
  );

  // do some modifications
  // GAME TIME
  gamestate.game.time += timeCounter;
  timeCounter += gamestateInterval / 1000;

  // BALL POSITIONING
  let fieldPosition = {};
  fieldPosition = RandomFieldPosition();
  //const x = Math.random() * 7000 - 3500; // random number between -3500 and 3500
  //const y = Math.random() * 10000 - 5000; // random number between -5000 and 5000
  gamestate.game.ballX = fieldPosition.X;
  gamestate.game.ballY = fieldPosition.Y;

  // PLAYER SCORES / BOOSTS / x/y/z
  let count = 0;
  gamestate.players = Object.keys(gamestate.players).map((playerName) => {
    const player = gamestate.players[playerName];
    const newScore = Math.floor(Math.random() * 1000);
    const newBoost = Math.random() * 100;
    const newSpeed = Math.random() * 100;

    player.name = randPlayers[count];

    player.score = newScore;
    player.boost = newBoost;
    player.speed = newSpeed;

    let p = RandomFieldPosition();
    player.x = p.X;
    player.y = p.Y;

    count += 1;
    return player;
  });

  //STATFEED
  //----------------------------------------------------------------------------------
  //save
  let statFeed = JSON.parse(
    fs.readFileSync("statfeed_event-sample.json", "utf-8")
  );
  statFeed.main_target.name = randPlayers[randomIntFromInterval(0, 5)];
  statFeed.type = "Save";
  //assist
  let assistFeed = JSON.parse(
    fs.readFileSync("statfeed_event-sample.json", "utf-8")
  );
  assistFeed.main_target.name = randPlayers[randomIntFromInterval(0, 5)];
  assistFeed.type = "Assist";
  //goal
  let goalFeed = JSON.parse(
    fs.readFileSync("goal_scored-sample.json", "utf-8")
  );
  goalFeed.scorer.name = randPlayers[randomIntFromInterval(0, 5)];
  goalFeed.type = "Goal";

  //SEND PACKET
  //----------------------------------------------------------------------------------
  let statOccurance = 10;
  let goalscored = 18;
  let replayStart = 20;
  let replaytWillEnd = 25;
  let replayEnd = 28;
  let podiumStart = 150;

  //STAT
  //----------------------------------------------------------------------------------
  //try sending a stat every 10sec
  if (timeCounter % statOccurance === 0) {
    let statevent = JSON.stringify({
      event: "game:statfeed_event",
      data: statFeed,
    });
    SendEvent(statevent, "sent statfeed");
  }
  //ASSIST
  //----------------------------------------------------------------------------------
  if (timeCounter === goalscored) {
    let e = JSON.stringify({
      event: "game:statfeed_event",
      data: assistFeed,
    });
    SendEvent(e, "sent statfeed");
  }
  //GOAL
  //----------------------------------------------------------------------------------
  if (timeCounter === goalscored) {
    let e = JSON.stringify({
      event: "game:goal_scored",
      data: goalFeed,
    });
    SendEvent(e, "sent statfeed");
  }
  //REPLAY START
  //----------------------------------------------------------------------------------
  if (timeCounter === replayStart) {
    //Run podium start
    let replayEvent = JSON.stringify({
      event: "game:replay_start",
      data: "game_replay_start",
    });
    SendEvent(replayEvent, "sent replayStart");
  }
  //REPLAY WILL END
  //----------------------------------------------------------------------------------
  if (timeCounter === replaytWillEnd) {
    //Run podium start
    let replayEvent = JSON.stringify({
      event: "game:replay_will_end",
      data: "game_replay_will_end",
    });
    SendEvent(replayEvent, "sent replayStart");
  }
  //REPLAY END
  //----------------------------------------------------------------------------------
  if (timeCounter === replayEnd) {
    //Run podium start
    let replayEvent = JSON.stringify({
      event: "game:replay_end",
      data: "game_replay_end",
    });
    SendEvent(replayEvent, "sent replayStart");
  }
  //PODIUM START
  //----------------------------------------------------------------------------------
  if (timeCounter === podiumStart) {
    //Run podium start
    let podiumEvent = JSON.stringify({
      event: "game:podium_start",
      data: "game_podium_start",
    });
    SendEvent(podiumEvent, "sent statfeed");
  }

  //Send Gamestate
  let gamestateMsg = JSON.stringify({
    event: "game:update_state",
    data: gamestate,
  });
  SendEvent(gamestateMsg, "sent gamestate");
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

function RandomFieldPosition() {
  let position = { X: 0, Y: 0 };
  position.X = Math.random() * 7000 - 3500; // random number between -3500 and 3500
  position.Y = Math.random() * 10000 - 5000; // random number between -5000 and 5000
  return position;
}

function SendEvent(gamestateMsg, msg) {
  wsClient.send(gamestateMsg);
  console.log(msg);
}

function GenerateRandomPlayers() {
  let usedPlayers = [];
  let players = [];
  players = Object.keys(PMAP.PLAYER_TEAM_MAP_TEST);
  let count = players.length;
  for (let i = 0; i < 6; i++) {
    let index = randomIntFromInterval(0, count);
    usedPlayers.push(players[index]);
  }
  return usedPlayers;
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
