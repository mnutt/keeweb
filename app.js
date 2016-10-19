var express = require('express');
var fs      = require('fs');
var api     = require('./server');
var path    = require('path');
var http    = require('http');
var compression = require('compression');

var root = __dirname;
var indexFile = path.resolve(root + '/dist/index.html');

if(!fs.existsSync(indexFile)) {
  console.error("Missing dist/index.html; run `grunt` to generate it.");
  process.exit(1);
}

var app = express();
var server = http.createServer(app);

app.use(express.static('dist'));

api(app, {httpServer: server});

app.use('/', function(req, res, next) {
  // send ember's index.html for any unknown route
  res.sendFile(indexFile);
});

var port = process.env.PORT || 8000;
var socket = process.env.SOCKET;

if(socket) {
  server.listen(socket, function() {
    console.log('Keeweb listening on %s', socket);
  });
} else {
  server.listen(port, function () {
    console.log('Keeweb listening on port %s', port);
  });
}
