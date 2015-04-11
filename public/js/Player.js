/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
    var x = startX,
        y = startY,
        id,
        color,
        deaths,
        armAngle = 0,
        armSpeed = 10,
        direction = 1,
        moveAmount = 5,
        yVel=0,
        xVel = 0,
        maxYVel = 20;
        gravity = 1,
        jumpVel = 20,
        width = 26,
        height = 40,
        armWidth = 10,
        armHeight = 18;
        doubleJump = false;
        timeout = new Date();

    var getJson = function() {
        return {id:id, x:x, y:y, armAngle:armAngle, dir:direction, color:color, deaths:deaths};
    };

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var getId = function() {
        return id;
    };

    var setId = function(newId){
        id = newId;
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

    var getDeaths = function(){
        return deaths;
    };

    var setDeaths = function(newDeaths){
        deaths = newDeaths;
    };
    
    var hit = function (dir){
        xVel = dir*15;
    }
    
    var update = function(keys, level, players) {

        if (y > 800){
            x = Math.round(Math.random()*50),
            y = Math.round(Math.random()*20);
            yVel = 0;
            deaths++;
            return true;
        }

        var prevX = x,
            prevY = y,
            prevArmAngle = armAngle,
            prevDir = direction;
        
        time = new Date();


        if (keys.up && level.checkCollision(x,y+1, width,height)) {
            //console.log("before: " + yVel);
            //yVel = -jumpVel; // no superjump, and no buggy half bounce.
            yVel -= jumpVel;  // superjump.
            //console.log("after:" + yVel);
            doubleJump = true;
            timeout = new Date();
            // double jump if in air and havent double jumped
        } else if (keys.up && doubleJump && time.getTime() - timeout.getTime() > 150){
          
          console.log(timeout.getTime());
          yVel = -jumpVel*3/4;
          doubleJump = false;
          timeout = time;
          //double jump
        }


        // Left key takes priority over right
        if (keys.left && Math.abs(xVel) < moveAmount){
            direction = -1;
            xVel = -moveAmount;
        } else if (keys.right && Math.abs(xVel) < moveAmount){
            direction = 1;
            xVel = moveAmount;
        }
        
        y += yVel
        if (level.checkCollision(x,y,width,height)){//fix movement if collision.
            if (yVel > 0){
                y = level.getLast().y - level.getLast().height/2-height/2;
                yVel = 0;
            } else if (yVel < 0){
                y = level.getLast().y + level.getLast().height/2+height/2;
                yVel = 0;
            }
           //y -= yVel;
            
        } else {// if (yVel < maxYVel){
            yVel += gravity;
        }

        x += xVel;

        if (xVel < 0) {
            if (level.checkCollision(x,y,width,height)){
                // x += moveAmount;
                x = level.getLast().x + level.getLast().width/2+width/2;
            }
            xVel += 1; //Drag
        } else if (xVel > 0) {
            // x += moveAmount;

            if (level.checkCollision(x,y,width,height)){
                // x -= moveAmount;
                x = level.getLast().x - level.getLast().width/2-width/2;
                
            }
            xVel -= 1; //Drag
        };




        if (armAngle > 10) {
            armSpeed = -Math.abs(armSpeed);
        } else if(armAngle < -90){
            armSpeed = Math.abs(armSpeed);
        }
        //console.log(keys.isDown("Q"));
        if(keys.isDown("Q")){
            // check collision with arm.
            //World to object transform
            //First translate by object center.
            //then rotate
            //then check bounds
            // if hit detected, emit hit.
            //console.log(players);
            for (i in players){
                //console.log(player.getId());
                //console.log(players[i].getJson());
                //console.log(id);
                //Temporary bounds check
                if(Math.abs(players[i].getX() - x) < 40 && Math.abs(players[i].getY() - y) < 20)
                    socket.emit("hit player", {id:players[i].getId(), dir:direction})
            }

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
        getId:getId,
        setId:setId,
        getDir: getDir,
        getArmAngle: getArmAngle,
        setDir: setDir,
        setArmAngle: setArmAngle,
        update: update,
        setColor: setColor,
        getColor: getColor,
        hit:hit,
        getDeaths:getDeaths,
        setDeaths:setDeaths,
        draw: draw
    }
};