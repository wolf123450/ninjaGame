// Placeholder file for Node.js game server
var http = require('http');
var util = require("util");
var io = require("socket.io");
var Player = require("./Player").Player;
var fs = require('fs');
var url = require('url');

var ROOT_DIR = "public/";
var socket;
var players;



function init(){
    var app = http.createServer(handler);
    players = [];
    socket = io(app);
    //socket.set("transports", ["websocket"]);
    //socket.set("secure", "true");
    app.listen(80);

	setEventHandlers();
};

function handler (request, response){
    var urlObj = url.parse(request.url, true, false);
    var filePath = "index.html";
    if (urlObj.pathname != "/"){
        filePath = urlObj.pathname;
    }
    fs.readFile(ROOT_DIR + filePath, function(err, data) {
        if (err) {
            response.writeHead(500);
            return response.end('Error loading index.html');
        }
        response.writeHead(200);
        response.end(data);
    });
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
    client.on("hit player", onHitPlayer);
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
  // console.log(data);
	var newPlayer = new Player(data.x, data.y);
	newPlayer.setId(this.id);
	newPlayer.setColor(data.color);
    newPlayer.setDeaths(data.deaths);
	this.broadcast.emit("new player", newPlayer.getJson());
	// console.log(newPlayer);
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        // console.log(i + existingPlayer.getColor());
        this.emit("new player", existingPlayer.getJson());
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
    movePlayer.setDeaths(data.deaths);

    this.broadcast.emit("move player", movePlayer.getJson());
};

function onHitPlayer(data){
    // console.log(this.id);
    // console.log(data);
    this.broadcast.emit("hit player", data);
};


function playerById(id) {
    var i;
    for (i=0; i < players.length; i++){
        if (players[i].getId() == id)
            return players[i];
    };

    return false;
};


init();
