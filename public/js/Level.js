/**************************************************
** GAME LEVEL CLASS
**************************************************/
var Level = function() {
	var objects = [];
  var lastHit;
	
  var getJson = function() {
    return {id:id, x:x, y:y, armAngle:armAngle, dir:direction};
  };


//Object format:
// {x:value, y:value, width:value, height:value, color:value}
  var addObject = function(x, y, width, height, color){
    objects.push({x:x, y:y, width:width, height:height, color:color});
  };
  
  var getObjects = function(){
    return objects;
  };

  var getLast = function(){
    return lastHit;
  }

  var draw = function(ctx){
    ctx.save();
    //ctx.fillStyle = "red";
    for (i in objects){
	ctx.fillStyle = objects[i].color;
      ctx.fillRect(objects[i].x-objects[i].width/2, objects[i].y-objects[i].height/2, objects[i].width, objects[i].height);
    }
    ctx.restore();
  }

  var checkCollision = function(x,y,width,height){
    var overlap;
    for (i in objects){
      overlap = true;
      overlap = overlap && objects[i].x + objects[i].width/2 > x - width/2;
      overlap = overlap && objects[i].x - objects[i].width/2 < x + width/2;
      overlap = overlap && objects[i].y + objects[i].height/2 > y - height/2;
      overlap = overlap && objects[i].y - objects[i].height/2 < y + height/2;
      if (overlap){
        lastHit = objects[i];
        return overlap;
      }
    }
    return overlap;
  };


	return {
    getJson:getJson,
    addObject:addObject,
    getObjects:getObjects,
    draw:draw,
    checkCollision:checkCollision,
    getLast:getLast
	}
};
