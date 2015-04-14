// Necessary inclusions
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var router = express.Router();
var conn = mongoose.connect('mongodb://localhost/ninjaGame');
var passport = require('passport') ;
require('./User'); // The user database model
//var mongoStore = require('connect-mongo')({session: expressSession});

// Set up configurations
app.use('/', express.static('./html', {maxAge: 60*60*1000}));
app.use(cookieParser());
app.use(bodyParser());
app.use(expressSession({
  secret: 'FarOverTheMistyMountains',
  cookie: {maxAge: 60*60*1000},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

// Passport user authentication
LocalStrategy = require('./config/passport')(passport);


app.get('/', function(req, res) {
  fs.readFile('./html/loggedin.html', 'utf8', function(err, data) {
    if(err) { console.log("couldnt open file");  return };
    res.status(200);
    res.send(data);
    res.end();
  });
});

app.get('/login', function(req, res) {
  fs.readFile('./html/login.html', 'utf8', function(err, data) {
    if(err) { console.log("couldnt open file");  return };
    res.status(200);
    res.send(data);
    res.end();
  });
});

app.post('/login', passport.authenticate('local-login',{
  successRedirect: '/', 
  failureRedirect: '/login', 
 // failureFlash: true 
}));

app.post('/createAccount', passport.authenticate('local-signup', {
  //successRedirect: '/',
  failureRedirect: '/login',
 // failureFlash: true
  }),
  function(req, res) {
    res.redirect('/');
  }
);

http.createServer(app).listen(80);
