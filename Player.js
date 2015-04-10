var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		direction,
		id,
		color,
		armAngle,
		deaths;

  var getJson= function(){
    // console.log("id:" +id);
    return {x:x,y:y,id:id,color:color,armAngle:armAngle,dir:direction,deaths:deaths};
  };
  
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX){
		x = newX;
	}

	var setY = function(newY){
		y = newY;
	};
	var setId = function(newId){
	  id = newId
	};
	var getId = function(){
	  return id;
	};
	
	
	var getColor = function(){
	  return color;
	};
	var setColor = function(newColor){
	  color = newColor;
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

	var getDeaths = function(){
        return deaths;
    };

    var setDeaths = function(newDeaths){
        deaths = newDeaths;
    };

		return {
			getX: getX,
			getY: getY,
			setX: setX,
			setY: setY,
			setColor:setColor,
			getColor:getColor,
			getDir: getDir,
			getArmAngle: getArmAngle,
			setDir: setDir,
			setArmAngle: setArmAngle,
			setId: setId,
			getId: getId,
			getDeaths:getDeaths,
        	setDeaths:setDeaths,	
			getJson:getJson
		}
	};

		exports.Player = Player;