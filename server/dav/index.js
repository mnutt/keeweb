var fs = require('fs');
var os = require('os');

var jsDAV                  = require("jsDAV/lib/jsdav");
var jsDAV_Server           = require("jsDAV/lib/DAV/server");
var jsDAV_Util             = require("jsDAV/lib/shared/util");
var Tree                   = require("./backend/tree");
var jsDAV_Locks_Backend_FS = require("jsDAV/lib/DAV/plugins/locks/fs");

jsDAV.debugMode = true;

exports.base = '/webdav';

exports.server = function(root) {
  console.log("Mounting webdav from data dir " + root);

  var tempDir = os.tmpdir();
  console.log("Storing temporary files in " + tempDir);

  var tree = Tree.new(root);

  var server = jsDAV.mount({
    tree: tree,
    tmpDir: tempDir,
    sandboxed: true,
    locksBackend: jsDAV_Locks_Backend_FS.new(root)
  });

  tree.setSandbox(tree.basePath);
  require('./backend/etag').tree = tree;

  server.baseUri = exports.base + '/';

  return function(req, res, next) {
    if(req.url.indexOf(exports.base) === 0) {
      server.emit('request', req, res);
    } else {
      next();
    }
  };
};
