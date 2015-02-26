// Placeholder file for Node.js game server
var util = require("util");
var io = require("socket.io")();
var Player = require("./Player").Player;

var socket;
var players;

function init(){
    players = [];
    socket = io.listen(8000);
    socket.set("transports", ["websocket"]);
    //socket.set("secure", "true");

	setEventHandlers();
};

function setEventHandlers(){
	socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    //console.log("New player has connected: " + client.id);
	util.log("New player has connected: " + client.id);

	client.on("disconnect", onClientDisconnect);
	client.on("new player", onNewPlayer);
	client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
    // When a player disconnects, remove it.
	util.log("Player has disconnected: " + this.id);
    var removePlayer = playerById(this.id);
    if (!removePlayer){
        util.log("Player not found: " + this.id);
        return;
    };

    players.splice(players.indexOf(removePlayer), 1);
    this.broadcast.emit("remove player", {id: this.id}); 
    // Tell all other connections to remove the player who left

};

function onNewPlayer(data) {
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };
	players.push(newPlayer);
};



function onMovePlayer(data) {
    var movePlayer = playerById(this.id);

    if (!movePlayer) {
        util.log("Player not found: "+this.id);
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
    movePlayer.setDir(data.dir);
    movePlayer.setArmAngle(data.armAngle);

    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(),
        dir: movePlayer.getDir(), armAngle: movePlayer.getArmAngle() });
};


function playerById(id) {
    var i;
    for (i=0; i < players.length; i++){
        if (players[i].id == id)
            return players[i];
    };

    return false;
};


init();
