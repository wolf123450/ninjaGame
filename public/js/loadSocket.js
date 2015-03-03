//newScript = document.createElement('script');
//newScript.type = 'text/javascript';
var src = 'http://52.10.36.235:8000/socket.io/socket.io.js';
//document.getElementsByTagName('body')[0].appendChild(newScript);

$.getScript(src, function() {
  $.getScript("js/requestAnimationFrame.js");
  $.getScript("js/Keys.js");
  $.getScript("js/Player.js");
  $.getScript("js/game.js", function(){
    console.log("Loaded game");
    init();
    animate();
  });  
});