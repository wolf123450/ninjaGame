/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
        color,
		armAngle = 0,
		armSpeed = 8,
		direction = 1,
		moveAmount = 5,
    yVel=0,
    maxYVel = 20;
    gravity = 1,
    jumpVel = 20,
    width = 26,
    height = 40;

    var getJson = function() {
        return {id:id, x:x, y:y, armAngle:armAngle, dir:direction, color:color};
    };

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
		var setColor = function(newColor){
		  console.log(newColor);
	    color = newColor;	
		};

    var getColor = function(){
      return color;
    };
    
    
	var update = function(keys, level) {

        if (y > 800){
            x = Math.round(Math.random()*50),
            y = Math.round(Math.random()*20);
            yVel = 0;
            return true;
        }

		var prevX = x,
			prevY = y,
			prevArmAngle = armAngle,
			prevDir = direction;

		if (keys.up && level.checkCollision(x,y+1, width,height)) {
			yVel -= jumpVel;
		} 
        
        y += yVel
        if (level.checkCollision(x,y,width,height)){
            if (yVel > 0){
                y = level.getLast().y - level.getLast().height/2-height/2;
                yVel = 0;
            } else if (yVel < 0){
                y = level.getLast().y + level.getLast().height/2+height/2;
                yVel = 0;
            }
           //y -= yVel;
            
        } else if (yVel < maxYVel){
            yVel += gravity;
        }

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
			direction = -1;
            if (level.checkCollision(x,y,width,height)){
                // x += moveAmount;
                x = level.getLast().x + level.getLast().width/2+width/2;
            }
		} else if (keys.right) {
			x += moveAmount;
			direction = 1;
            if (level.checkCollision(x,y,width,height)){
                // x -= moveAmount;
                x = level.getLast().x - level.getLast().width/2-width/2;
                
            }
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
        ctx.fillStyle = color; //Body
        ctx.fillRect(-width/2, -height/2, width, height);

        ctx.fillStyle = "tan"; //Face
        ctx.fillRect (2, 7-height/2, 10, 10);

        ctx.fillStyle = "blue"; //Eye
        ctx.fillRect(7, 10-height/2, 3, 3);

        ctx.fillStyle = "black"; //belt
        ctx.fillRect(-13, 25-height/2, 26, 5);

        ctx.save();
        ctx.translate(2, 25-height/2);
        ctx.rotate((Math.PI/180) * armDeg);
        ctx.fillStyle = color; //arm
        ctx.fillRect(-5, -5, 18, 10);
        ctx.strokeStyle= "black";
        ctx.strokeRect(-5,-5, 18, 10);
        ctx.fillStyle = "tan"; //Hand
        ctx.fillRect (14, -4, 5, 8);
        ctx.restore();

        ctx.restore();
    }

	return {
	  getJson:getJson,
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getDir: getDir,
		getArmAngle: getArmAngle,
		setDir: setDir,
		setArmAngle: setArmAngle,
		update: update,
		setColor: setColor,
		getColor: getColor,
		draw: draw
	}
};