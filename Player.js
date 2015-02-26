var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id;

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

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getDir: getDir,
		getArmAngle: getArmAngle,
		setDir: setDir,
		setArmAngle: setArmAngle,
		id: id
	}
};

exports.Player = Player;