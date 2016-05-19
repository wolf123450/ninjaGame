var Player = function ( startX, startY ) {
    this.x = startX;
    this.y = startY;
        // direction,
        // id,
        // color,
        // armAngle,
        // username,
        // deaths;

    var getJson = function () {
        // console.log("id:" +id);
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            color: this.color,
            armAngle: this.armAngle,
            dir: this.direction,
            deaths: this.deaths,
            username: this.username
        };
    };

    var setFromJson = function(data){
        // console.log(JSON.stringify(data));
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.armAngle = data.armAngle;
        this.direction = data.dir;
        this.color = data.color;
        this.deaths = data.deaths;
        this.username = data.username;
    };

    var getUsername = function(){
        return this.username;
    };

    var setUsername = function(newName) {
        this.username = newName;
    };

    var getX = function () {
        return this.x;
    };

    var getY = function () {
        return this.y;
    };

    var setX = function ( newX ) {
        this.x = newX;
    }

    var setY = function ( newY ) {
        this.y = newY;
    };
    var setId = function ( newId ) {
        this.id = newId
    };
    var getId = function () {
        return this.id;
    };


    var getColor = function () {
        return this.color;
    };
    var setColor = function ( newColor ) {
        this.color = newColor;
    };
    var getDir = function () {
        return this.direction;
    };
    var getArmAngle = function () {
        return this.armAngle;
    };
    var setDir = function ( newDir ) {
        this.direction = newDir;
    };
    var setArmAngle = function ( newArmAngle ) {
        this.armAngle = newArmAngle;
    };

    var getDeaths = function () {
        return this.deaths;
    };

    var setDeaths = function ( newDeaths ) {
        this.deaths = newDeaths;
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        setColor: setColor,
        getColor: getColor,
        getDir: getDir,
        getArmAngle: getArmAngle,
        setDir: setDir,
        setArmAngle: setArmAngle,
        setId: setId,
        getId: getId,
        getDeaths: getDeaths,
        setDeaths: setDeaths,
        getJson: getJson,
        setFromJson: setFromJson,
        setUsername: setUsername,
        getUsername: getUsername
    }
};

exports.Player = Player;
