var path                 = require('path');
var morgan               = require('morgan');
var dav                  = require('./dav');

module.exports = function(app, options) {
  var root = path.resolve(process.env.STORAGE_PATH || (__dirname + "/../data"));

  // Log proxy requests
  app.use(morgan('dev'));

  // WebDAV: /remote.php/webdav/*
  var davServer = dav.server(root);
  app.use(davServer);
};
