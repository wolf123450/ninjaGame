var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var basicAuth = require('basic-auth-connect');
var app = express();
var options = {
	host: '127.0.0.1',
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt')
};
var auth = basicAuth(function (user, pass) {
  return ((user==='cs360')&&(pass==='test'));
});
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
app.use('/', express.static('./html', {maxAge: 60*60*1000}));
app.get('/', function(req, res) {
  fs.readFile('./html/login.html', 'utf8', function(err, data) {
    if(err) { console.log("couldnt open file");  return };
    res.status(200);
    res.send(data);
    res.end();
  });
});


