// Node native modules
var http = require('http');

// Application modules
var router = require('./middleware/router'),
    routes = require('./routes'),
   session = require('./services/sessionStore');

var port = 8080;

session.init();
routes.init(router, session);

var handleRequest = function(request, response){
    router.execute(request, response);
};

var server = http.createServer(handleRequest);

server.listen(port, function(){
    console.log('listening on ' + port);
});
