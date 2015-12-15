var url = require('url');
var fs = require('fs');

var dataStore = {
  results: []
}

var requestHandler = function(request, response) {
  // Request and Response come from node's http module. They include information about
  // both the incoming request, such as headers and URL, and about the outgoing response,
  // such as its status and content. Documentation for both request and response can be
  // found in the HTTP section at http://nodejs.org/documentation/api/

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/JSON";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  var parsed = url.parse(request.url, true);
  var route = parsed.pathname

  if (route === '/classes/messages' || route === '/classes/room1') {
    if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();
    } else if (request.method === 'GET') {
      response.writeHead(200, headers);
      response.end(JSON.stringify(dataStore));
    } else if (request.method === 'POST') {
      var dataHolder = '';
      request.on('data', function(data) {
        dataHolder += data;
      });

      request.on('end', function() {
        dataStore.results.push(JSON.parse(dataHolder));
        response.writeHead(201, headers);
        response.end();
      });
    }
  } else {
    response.writeHead(404, headers);
    response.end();
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS). Your chat client
// is running from a url like file://your/chat/client/index.html, which is considered
// a different domain.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
