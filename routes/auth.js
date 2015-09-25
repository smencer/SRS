var authenticationHelper = require('../util/authenticationHelper'),
                      qs = require('querystring'),
                   users = require('../services/userStore'),
          responseHelper = require('../util/responseHelper');

var sessionStore;

var authRoutes = {
    init: function(router, session){
        sessionStore = session;

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

                        sessionStore.createSession(message.token, message.username);

                        responseHelper.send(route, message, request, response);
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
        
                if(sessionStore.endSession(postBody.token)){
                    var message = {
                        message: 'Log out operation complete',
                    }
                    responseHelper.send(route, message, request, response);
                } else {
                    var errorMessage = {
                        error: 'Unable to locate authenticated session'
                    }
                    responseHelper.send(router.getRouteKey('GET', '/login'), errorMessage, request, response);
                }
            });
        });   
    }
};

module.exports = authRoutes;
