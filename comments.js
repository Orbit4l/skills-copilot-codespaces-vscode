// Create web server
var http = require('http');
// Create file system
var fs = require('fs');
// Create path
var path = require('path');
// Create mime
var mime = require('mime');
// Create cache
var cache = {};
// Create chat server
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

// Create server
var server = http.createServer(function(request, response) {
  var filePath = false;
  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }
  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});
server.listen(3000, function() {
  console.log("Server listening on port 3000.");
});

// Create socket.io
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

// Create 404
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

// Create file data
function sendFile(response, filePath, fileContents) {
  response.writeHead(200, {"Content-Type": mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

// Create cache
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    // Check if file exists
    fs.exists(absPath, function(exists) {
      if (exists) {
        // Read file
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            // Add file to cache
            cache[absPath] = data;
            // Send file
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}