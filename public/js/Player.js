/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		armAngle = 0,
		armSpeed = 8,
		direction = 1,
		moveAmount = 2;

		var getX = function() {
		    return x;
		};

		var getY = function() {
		    return y;
		};

		var setX = function(newX) {
		    x = newX;
		};

		var setY = function(newY) {
		    y = newY;
		};

		var getDir = function() {
			return direction;
		};
		var getArmAngle = function(){
			return armAngle;
		};
		var setDir = function(newDir) {
			direction = newDir;
		};
		var setArmAngle = function(newArmAngle){
			armAngle = newArmAngle;
		};

	var update = function(keys) {
		var prevX = x,
			prevY = y,
			prevArmAngle = armAngle,
			prevDir = direction;

		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
			direction = -1;
		} else if (keys.right) {
			x += moveAmount;
			direction = 1;
		};

		if (armAngle > 10) {
            armSpeed = -Math.abs(armSpeed);
        } else if(armAngle < -90){
            armSpeed = Math.abs(armSpeed);
        }
        //console.log(keys.isDown("Q"));
		if(keys.isDown("Q")){
			armAngle += armSpeed;
        } else {
            armAngle = 0;
        }

		return (prevX != x || prevY != y || prevArmAngle != armAngle || prevDir != direction) ? true : false;
	};

	var draw = function(ctx) {
		//ctx.fillRect(x-5, y-5, 10, 10);
		ninja(x,y, armAngle, direction);
	};

	function ninja( x, y, armDeg, dir){
        ctx.save();
        //ctx.clearRect(0,0,canvas.width, canvas.height);
        
        ctx.translate(x,y);
        ctx.scale(dir, 1);
        ctx.fillStyle = "rgb(86, 86, 86)"; //Body
        ctx.fillRect(-13, 0, 26, 40);

        ctx.fillStyle = "tan"; //Face
        ctx.fillRect (2, 7, 10, 10);

        ctx.fillStyle = "blue"; //Eye
        ctx.fillRect(7, 10, 3, 3);

        ctx.fillStyle = "black"; //belt
        ctx.fillRect(-13, 25, 26, 5);

        ctx.save();
        ctx.translate(2, 25);
        ctx.rotate((Math.PI/180) * armDeg);
        ctx.fillStyle = "rgb(86, 86, 86)"; //arm
        ctx.fillRect(-5, -5, 18, 10);
        ctx.strokeStyle= "black";
        ctx.strokeRect(-5,-5, 18, 10);
        ctx.fillStyle = "tan"; //Hand
        ctx.fillRect (14, -4, 5, 8);
        ctx.restore();

        ctx.restore();
    }

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getDir: getDir,
		getArmAngle: getArmAngle,
		setDir: setDir,
		setArmAngle: setArmAngle,
		update: update,
		draw: draw
	}
};