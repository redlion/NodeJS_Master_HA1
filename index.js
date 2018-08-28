/*
 *
 *  Hello World API 
 * 
 */

const http = require('http');
const url = require('url');

// Function to handle the Request
var handleRequest = function(req, res) {
  // Get url and parsed object: Object includes, query, search, pathname, path, href
  var parsedURL = url.parse(req.url, true);

  // Get the pathname
  var pathName = parsedURL.pathname;
  var trimmedPath = pathName.replace(/^\/+|\/+$/g,'');

  var buffer = '';

  req.setEncoding('utf8');

  req.on('data', function(data) {
    buffer += data;
  });

  req.on('error', function(err) {
    console.error(err);
  });

  req.on('end', function() {
    // Get the handler base on the path given.
    const requestedHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    requestedHandler(function(statusCode, payload) {
      // set status to handler's statusCode or use 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // set payload to handler's payload or empty object
      payload = typeof(payload) == 'object' ? payload : {};
    
      // convert payload to String
      const payloadString = JSON.stringify(payload);

      // Configure response and end 
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // log the response
      console.log('The reponse to use is: ', statusCode, payloadString);
    });
  });
};

// Define Handlers
const handlers = {};

// hello handler
handlers.hello = function(cb) {
  cb(200, {'hello': 'I am a node chatbot.'});
};

handlers.notFound = function(cb) {
  cb(404);
};

// Define a request router
const router = {
  'hello': handlers.hello
}

// Initial the http server
const httpServer = http.createServer(function(req, res) {
  handleRequest(req, res);
});

httpServer.listen(3000, function() {
  console.log('The server is listening on port 3000.')
});
