var authRoutes = function(router){
    this.router = router;
}

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

module.exports = authRoutes;
