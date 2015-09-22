var http = require('http'),
      fs = require('fs'),
    path = require('path');

var port = 8080;

var authenticatedSessions = {};

var users = {
    'admin': {
        passwordhash: '',
        email: 'admin@localhost.com'
    }
};

var templateHelper = {
    renderTemplate: function(template, model){
        
    }
};

var templates = {
    'GET:/login': 'views/login.html',
    'POST:/login': 'views/index.html',
    'POST:/logout': 'views/index.html'
};

var router = {
    routes: {
        '404': function(route, request, response){
            response.statusCode =  404;
            response.statusMessage = 'Not Found';
            response.end('Object Not Found');
        }
    },
    registerRoute: function(method, url, handler){
        this.routes[this.getRouteKey(method, url)] = handler;
    },
    buildRoute: function(request){
        return this.getRouteKey(request.method, request.url);
    },
    getRouteKey: function(method, url){
        return method + ':' + url;
    },
    checkForMatch: function(request){
        var template = this.buildRoute(request);
        console.log('Requested [' + template + ']');
        if(this.routes.hasOwnProperty(template)){
            return template;
        } else {
            return '404';
        }
    },
    execute: function(request, response){
        var route = this.checkForMatch(request);
        console.log('Responding with [' + route + ']');
        this.routes[route](route, request, response);
    }
};

responseHelper = {
    send: function(route, model, request, response){
        if(request.headers.accept === 'application/json'){
            this.sendJson(model, response);
        }
        else{
            this.sendHtml(route, model, response);
        }       
    },
    sendJson: function(model, response){
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(model));
    },
    sendHtml: function(route, model, response){
        var filePath = templates[route];
        var stat = fs.statSync(filePath);

        response.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': stat.size
        });

        var fileStream = fs.createReadStream(filePath);
        fileStream.pipe(response);
    }
};

router.registerRoute('GET', '/login', function(route, request, response){
    var message = {
        body: 'POST to this endpoint to login (include user and password in POST body).',
    };
    responseHelper.send(route, message, request, response);
});

router.registerRoute('POST', '/login', function(route, request, response){
    // check credentials
    var message = {};
    responseHelper.send(route, message, request, response);
});

router.registerRoute('POST', '/logout', function(route, request, response){
    var message = {};
    responseHelper.send(route, message, request, response);
});

var handleRequest = function(request, response){
    router.execute(request, response);
};

var server = http.createServer(handleRequest);

server.listen(port, function(){
    console.log('listening on ' + port);
});
