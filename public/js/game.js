/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	level,
	localPlayer,    // Local player
	remotePlayers,
	cameraX,
	cameraY,
	socket;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*50),
		startY = Math.round(Math.random()*20);

	// Initialise the local player
	localPlayer = new Player(startX, startY);
	level = new Level();
	level.addObject(0, 200, 800, 50);
	console.log(document.domain);
	// socket = io.connect("http://"+document.domain+":8000", { port: 8000, transports: ["websocket"]});
	socket = io("http://"+document.domain);
	// Start listening for events
	setEventHandlers();

	remotePlayers = [];
	cameraX = 0;
	cameraY = 0;
	
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", localPlayer.getJson());
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
    socket.emit("remove player", {id: localPlayer.id});
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    //remotePlayers = [];
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	if (!movePlayer) {
	    console.log("Player not found: "+data.id);
	    return;
	};

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setDir(data.dir);
	movePlayer.setArmAngle(data.armAngle);
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);
	console.log("remove player");
	if (!removePlayer){
		util.log("Player not found: " + data.id);
		return;
	};

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	if (localPlayer.update(keys, level)) {
	    socket.emit("move player", localPlayer.getJson());
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	

	//draw players
	ctx.save();
	cameraX = canvas.width/2 - localPlayer.getX();
	cameraY = canvas.height/2 - localPlayer.getY();
	ctx.translate(cameraX, cameraY);

	//draw the level
	level.draw(ctx);
	
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.font = "20px serif";
	var message = "(" + localPlayer.getX() + "," + localPlayer.getY() + ")";
  	ctx.strokeText(message, localPlayer.getX(), localPlayer.getY()-25);
	
	// Draw the local player
	localPlayer.draw(ctx);
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
	    remotePlayers[i].draw(ctx);
	};
	ctx.restore();
};

function playerById(id) {
    var i;
    for (i=0; i < remotePlayers.length; i++){
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};
