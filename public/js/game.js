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
    localPlayer.setColor("rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")");
	$.getJSON('/color', function(data){
        localPlayer.setColor(data.color);
    });

    localPlayer.setDeaths(0);
	$.getJSON('/deaths', function(data){
	    localPlayer.setDeaths(data.deaths);
	});
	
	
  localPlayer.setCharacter("cowboy");
	level = new Level();
	level.addObject(0, 200, 800, 50,"red");
	level.addObject(1100,200,800,50,"black");
        level.addObject(2000,700,1800,35,"yellow");
	level.addObject(1075,475,800,50,"blue")

	level.addObject(1500,25,100,30,"purple");
        level.addObject(1800,-150,100,30,"purple");
        level.addObject(2100,-325,100,30,"purple");
        level.addObject(2400,-500,100,30,"purple");
        level.addObject(2100,-675,100,30,"purple");
        level.addObject(1800,-850,100,30,"purple");
        level.addObject(1500,-1025,100,30,"purple");

        level.addObject(800,-1200,800,50,"white");

    level.addObject(-200, 100, 225, 20,"blue");
    level.addObject(200, 100, 200, 20,"green");
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
	socket.on("hit player", onHitPlayer);
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
    localPlayer.setId(this.id);
    socket.emit("new player", localPlayer.getJson());
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
    socket.emit("remove player", {id: localPlayer.getId()});
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
    console.log(data);
    //remotePlayers = [];
    var newPlayer = new Player(data.x, data.y);
    newPlayer.setId(data.id);
    newPlayer.setColor( data.color);
    newPlayer.setDeaths(data.deaths);
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
	movePlayer.setDeaths(data.deaths);
};

function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);
	console.log("remove player");
	if (!removePlayer){
		console.log("Player not found: " + data.id);
		return;
	};

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function onHitPlayer(data) {
	if (data.id == localPlayer.getId()){
		localPlayer.hit(data.dir);
	}
	//console.log(data);
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
	if (localPlayer.update(keys, level, remotePlayers)) {
	    socket.emit("move player", localPlayer.getJson());
	};
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);


	//deaths
	ctx.save();
	ctx.strokeStyle = localPlayer.getColor();
	ctx.font = "20px serif";
	ctx.strokeText(localPlayer.getDeaths(), 30,25);
	
	for (i in remotePlayers){
		ctx.strokeStyle = remotePlayers[i].getColor();
		ctx.strokeText(remotePlayers[i].getDeaths(), 30 + (Number(i)+1)*30,25);
		//console.log(Number(i)+1);
	}

	ctx.restore();
	
	ctx.save();
	cameraX = canvas.width/2 - localPlayer.getX(); //Center on player
	cameraY = canvas.height/2 - localPlayer.getY();
	ctx.translate(cameraX, cameraY);

	//draw the level
	level.draw(ctx);
	
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.font = "20px serif";
	//ctx.strokeStyle = "red";
	//var message = "(" + localPlayer.getX() + "," + localPlayer.getY() + ")";
	var message = Math.floor(localPlayer.getDamage()*100);
	ctx.strokeStyle = "rgb("+(message+150)+","+(200-message)+",0)";
  ctx.strokeText(message, localPlayer.getX(), localPlayer.getY()-25);
  	
	
	// Draw the local player
	localPlayer.draw(ctx);
	// console.log(localPlayer.getColor());
	//draw players
	var i;
	for (i in remotePlayers) {
	    remotePlayers[i].draw(ctx);
	};
	ctx.restore();
};

function playerById(id) {
    var i;
    for (i=0; i < remotePlayers.length; i++){
        if (remotePlayers[i].getId() === id)
            return remotePlayers[i];
    };

    return false;
};
