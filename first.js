// Node native modules
var http = require('http'),
      fs = require('fs'),
    path = require('path'),
      qs = require('querystring');

// Application modules
var authenticationHelper = require('./util/authenticationHelper'),
                  router = require('./middleware/router'),
          responseHelper = require('./util/responseHelper'),
                   users = require('./services/userStore');

var port = 8080;

var handleRequest = function(request, response){
    router.execute(request, response);
};

var server = http.createServer(handleRequest);

server.listen(port, function(){
    console.log('listening on ' + port);
});
