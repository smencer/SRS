var http = require('http'),
      fs = require('fs'),
    path = require('path'),
  crypto = require('crypto'),
      qs = require('querystring');

var port = 8080;

var authenticatedSessions = {};

var users = {
    'admin': {
        passwordhash: '3d1a9d2a76114707',
        email: 'smencer@gmail.com'
    }
};


var authenticationHelper = {
    algorithm: 'aes-256-ctr',
    salt: 'salty',
    encrypt: function(text){
        var cipher = crypto.createCipher(this.algorithm, this.salt)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function(text){
        var decipher = crypto.createDecipher(this.algorithm, this.salt)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
};

var templateHelper = {
    renderTemplate: function(template, model){
        for(var property in model){
            if(model.hasOwnProperty(property)){
                var re = new RegExp('{{\\s*' + property + '\\s*}}', 'g');
                template = template.replace(re, model[property]);
            }
        }

        return template;
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

        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        var fileContents = fs.readFileSync(filePath, 'utf8');
        var rendered = templateHelper.renderTemplate(fileContents, model);
        response.end(rendered);
    }
};

router.registerRoute('GET', '/login', function(route, request, response){
    var message = {
        body: 'POST to this endpoint to login (include user and password in POST body).',
        error: ''
    };
    responseHelper.send(route, message, request, response);
});

router.registerRoute('POST', '/login', function(route, request, response){
    var body = '';

    request.on('data', function(data){
        body += data;
    });

    request.on('end', function(){
        var postBody = qs.parse(body);

        if(users.hasOwnProperty(postBody.user)){
            var passwordHash = authenticationHelper.encrypt(postBody.password);
            if(users[postBody.user].passwordhash === passwordHash){
                var message = {
                    username: postBody.user,
                    token: authenticationHelper.encrypt(new Date().toISOString())
                }

                if(authenticatedSessions.hasOwnProperty(message.username)){
                    responseHelper.send(route, {error: 'Already logged in'}, request, response);
                } else {
                    var expiration = new Date();
                    var minutes = expiration.getMinutes() + 20;
                    expiration.setMinutes(minutes);
                    authenticatedSessions[message.token] = expiration;
                    console.log(expiration.toLocaleString());
                    responseHelper.send(route, message, request, response);
                }
            } else {
                var errorMessage = {
                    error: 'Unknown user or wrong password'
                }
                responseHelper.send(router.getRouteKey('GET', '/login'), errorMessage, request, response);
            }
        } else {
            var errorMessage = {
                error: 'Unknown user or wrong password'
            }
            responseHelper.send(router.getRouteKey('GET', '/login'), errorMessage, request, response);
        }
    });
});

router.registerRoute('POST', '/logout', function(route, request, response){
    var body = '';

    request.on('data', function(data){
        body += data;
    });

    request.on('end', function(){
        var postBody = qs.parse(body);

        if(authenticatedSessions.hasOwnProperty(postBody.token)){
            var message = {
                message: 'Log out operation complete',
            }
            delete authenticatedSessions[postBody.token];
            responseHelper.send(route, message, request, response);
        } else {
            var errorMessage = {
                error: 'Unable to locate authenticated session'
            }
            responseHelper.send(router.getRouteKey('GET', '/login'), errorMessage, request, response);
        }
    });
});

var handleRequest = function(request, response){
    router.execute(request, response);
};

var server = http.createServer(handleRequest);

server.listen(port, function(){
    console.log('listening on ' + port);
});
