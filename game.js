// Placeholder file for Node.js game server
//var http = require('http');
var util = require("util");
//var io = require("socket.io");
var Player = require("./Player")
  .Player;
var fs = require('fs');
var url = require('url');

var express = require('express');
var app = express();
var server = require('http')
  .Server(app)
var io = require('socket.io')(server);

//login stuff
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var router = express.Router();
var conn = mongoose.connect('mongodb://localhost/ninjaGame');
var passport = require('passport');
var User = require('./User'); // The user database model

var ROOT_DIR = "/public/";
var socket;
var players;



function init() {
  //var app = http.createServer(handler);
  players = [];
  //socket = io(app);
  //socket.set("transports", ["websocket"]);
  //socket.set("secure", "true");
  //app.listen(80);
  server.listen(80);
  app.use('/', express.static('.' + ROOT_DIR, {
    maxAge: 60 * 60 * 1000
  }));
  //app.get('/', handler);

  routes();
  setEventHandlers();
};

function routes() {
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(expressSession({
    secret: 'FarOverTheMistyMountains',
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 60 * 60 * 1000 // 1 hour in ms
    },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(router);

  // Passport user authentication
  LocalStrategy = require('./config/passport')(passport);

  app.get('/', function(req, res) {
    if (req.user) {
      console.log("logged in as " + req.user.username);
      res.sendFile('game.html', {
        root: __dirname + ROOT_DIR,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      });
    } else {
      console.log("not logged in");
      res.sendFile('login.html', {
        root: __dirname + ROOT_DIR,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      });
    }
    //res.sendFile(ROOT_DIR + 'game.html');
  });
  // app.get('/', function(req, res) {
  //   fs.readFile(ROOT_DIR + 'index.html', 'utf8', function(err, data) {
  //     if (err) {
  //       console.log("couldnt open file");
  //       return
  //     };
  //     res.status(200);
  //     res.send(data);
  //     res.end();
  //   });
  // });

  app.get('/deaths', function(req, res) {
    var deaths = 0;
    if (req.user) {
      deaths = req.user.losses;
    }
    console.log("deaths " + deaths);
    res.status(200);

    res.end(JSON.stringify({
      deaths: deaths
    }));

  });

  app.get('/updeaths', function(req, res) {
    if (req.user) {
      User.findOne({
          'username': req.user.username
        },
        function(err, user) {
          if (err) {
            console.log('updeaths error');
            return;
          }

          if (!user) {
            console.log('Could not find user: ' + username);
            return;
          }

          user.uploses();

          return;

        });
      res.status(200);
      res.end();
      util.log('updeaths ' + req.user.username);
    } else {
      util.log("you didn't say the magic word");
      res.status(200);
      res.end();
    }

  });

  app.get('/color', function(req, res) {
    //var color = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
    //var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    var color = "#" + ('00000' + (Math.random() * 0xFFFFFF << 0)
        .toString(16))
      .slice(-6)
    if (req.user && req.user.color) {
      color = req.user.color;
    } else if (req.user) {
      User.findOne({
          'username': req.user.username
        },
        function(err, user) {
          if (err) {
            console.log('choosecolor error');
            return;
          }

          if (!user) {
            console.log('Could not find user: ' + username);
            return;
          }

          user.setColor(color);

          return;

        });
    }
    console.log("color " + color);
    res.status(200);

    res.end(JSON.stringify({
      color: color
    }));
  });

  app.post('/color', function(req, res) {
    console.log(req.body);
    if (req.body.color && req.user) {
      User.findOne({
          'username': req.user.username
        },
        function(err, user) {
          if (err) {
            console.log('choosecolor error');
            return;
          }

          if (!user) {
            console.log('Could not find user: ' + username);
            return;
          }

          user.setColor(req.body.color);

          return;

        });
    }
    res.status(200);
    res.end();
  })

  app.get('/login', function(req, res) {
    fs.readFile(ROOT_DIR + 'login.html', 'utf8', function(err, data) {
      if (err) {
        console.log("couldnt open file");
        return
      };
      res.status(200);
      res.send(data);
      res.end();
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
    console.log("logout");
  })

  // app.post('/login', passport.authenticate('local-login',{
  //   successRedirect: '/',
  //   failureRedirect: '/login'
  //   // failureFlash: true
  // }));

  app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      switch (req.accepts('html', 'json')) {
        case 'html':
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.redirect('/login');
          }
          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            return res.redirect('/');
          });
          break;
        case 'json':
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(200)
              .send({
                "ok": false
              });
          }
          req.logIn(user, function(err) {
            if (err) {
              return res.status(200)
                .send({
                  "ok": false
                });
            }
            return res.send({
              "ok": true
            });
          });
          break;
        default:
          res.status(406)
            .send();
      }
    })(req, res, next);
  });

  //    app.post( '/createAccount', passport.authenticate( 'local-signup', {
  //            //successRedirect: '/',
  //            failureRedirect: '/login',
  //            // failureFlash: true
  //        } ),
  //        function ( req, res ) {
  //            res.redirect( '/' );
  //        }
  //    );

  app.post('/createAccount', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        //return res.redirect( '/login' );
        res.status(200);
        return res.end(JSON.stringify({
          ok: false
        }));
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        //return res.redirect( '/profile.html' );
        res.status(200);
        return res.end(JSON.stringify({
          ok: true
        }));
      });
    })(req, res, next);
  });

  app.get('/api/user_data', function(req, res) {

    if (req.user === undefined) {
      // The user is not logged in
      res.json({
        ok: false
      });
    } else {
      res.json({
        username: req.user
      });
    }
  });
};

function handler(request, response) {
  var urlObj = url.parse(request.url, true, false);
  var filePath = "index.html";
  if (urlObj.pathname != "/") {
    filePath = urlObj.pathname;
  }
  fs.readFile(ROOT_DIR + filePath, function(err, data) {
    if (err) {
      response.writeHead(500);
      return response.end('Error loading index.html');
    }
    response.writeHead(200);
    response.end(data);
  });
};

function setEventHandlers() {
  //socket.sockets.on("connection", onSocketConnection);
  io.on('connection', onSocketConnection);
};

function onSocketConnection(client) {
  //console.log("New player has connected: " + client.id);
  util.log("New player has connected: " + client.id);
  //util.log(JSON.stringify(client.request.headers));
  // for ( i in client.request ) {
  //     //util.log(i);
  //     //util.log(client.request[i]);
  // }


  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("move player", onMovePlayer);
  client.on("hit player", onHitPlayer);
};

function onClientDisconnect() {
  // When a player disconnects, remove it.
  util.log("Player has disconnected: " + this.id);
  var removePlayer = playerById(this.id);
  // console.log(removePlayer);
  if (!removePlayer) {
    util.log("Player not found to remove: " + this.id);
    return;
  };

  players.splice(players.indexOf(removePlayer), 1);
  this.broadcast.emit("remove player", {
    id: this.id
  });
  // Tell all other connections to remove the player who left

};

function onNewPlayer(data) {
  // console.log(data);
  var newPlayer = new Player(data.x, data.y);

  newPlayer.setFromJson(data);
  util.log("Player name: " + newPlayer.getUsername());
  //newPlayer.setId( this.id );
  //console.log(data);
  //console.log(newPlayer.getJson());
  // newPlayer.setColor( data.color );
  // newPlayer.setDeaths( data.deaths );
  this.broadcast.emit("new player", newPlayer.getJson());
  // console.log(newPlayer);
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    // console.log(i + existingPlayer.getColor());
    this.emit("new player", existingPlayer.getJson());
  };
  players.push(newPlayer);
  // console.log(players[0].getId());
};



function onMovePlayer(data) {
  var movePlayer = playerById(this.id);

  if (!movePlayer) {
    util.log("Player not found to move: " + this.id);
    // util.log(players[0].getId());
    return;
  };

  //movePlayer.setFromJson(data);
  movePlayer.setUsername(data.username);
  movePlayer.setX(data.x);
  movePlayer.setY(data.y);
  movePlayer.setDir(data.dir);
  movePlayer.setArmAngle(data.armAngle);
  movePlayer.setDeaths(data.deaths);

  this.broadcast.emit("move player", movePlayer.getJson());
};

function onHitPlayer(data) {
  // console.log(this.id);
  // console.log(data);
  this.broadcast.emit("hit player", data);
};


function playerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (id.indexOf(players[i].getId()) > 0)
      return players[i];
  };

  return false;
};



init();
