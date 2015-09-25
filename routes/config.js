var responseHelper = require('../util/responseHelper'),
                qs = require('querystring'),
               url = require('url');
       configStore = require('../services/configStore');

var session;

var authRoutes = {
    init: function(router, session){
        session = session;
        configStore.init();

        // Create
        router.registerRoute('POST', '/config', function(route, request, response){
            var body = '';
        
            request.on('data', function(data){
                body += data;
            });
        
            request.on('end', function(){
                var postBody = JSON.parse(body);

                configStore.createOrUpdateModel(postBody);
        
                response.writeHead(201, {'Content-Type': 'application/json'});
                responseHelper.send(route, {message: 'created ' + postBody.name}, request, response);
            });

        });
        
        // Retrieve
        router.registerRoute('GET', '/config', function(route, request, response){
            var parsed = url.parse(request.url);
            var query = qs.parse(parsed.query);

            var result = configStore.fetchModel(query);

            responseHelper.send(route, result, request, response);
        });

        // Update
        router.registerRoute('PUT', '/config', function(route, request, response){
            var parsed = url.parse(request.url);
            var query = qs.parse(parsed.query);

            var body = '';
        
            request.on('data', function(data){
                body += data;
            });
        
            request.on('end', function(){
                var postBody = JSON.parse(body);
                var message;

                if(query.name === postBody.name) {
                    var result = configStore.fetchModel(query.name);
                    if(result) {
                        configStore.createOrUpdateModel(postBody);
                        message = {message: 'updated' + postBody.name}
                        response.writeHead(200, {'Content-Type': 'application/json'});
                    } else {
                        message = {message: 'unable to find existing configuration with name: ' + postBody.name};
                        response.writeHead(404, {'Content-Type': 'application/json'});
                    }
                } else {
                    message = {message: 'name in querystring [' + query.name + '] did not match model posted in body: ' + postBody.name};
                    response.writeHead(400, {'Content-Type': 'application/json'});
                }
        
                responseHelper.send(route, message, request, response);
            });
        });
        
        // Delete
        router.registerRoute('DELETE', '/config', function(route, request, response){
            var parsed = url.parse(request.url);
            var query = qs.parse(parsed.query);

            var result = configStore.fetchModel(query.name);

            var message;

            if(result){
                configStore.deleteModel(query.name);
                response.writeHead(200, {'Content-Type': 'application/json'});
                message = {message: 'deleted: ' + query.name};
            } else {
                response.writeHead(404, {'Content-Type': 'application/json'});
                message = {message: 'Unable to find configuration with name: ' + query.name};
            }
            
            responseHelper.send(route, message, request, response);
        });   
    }
};

module.exports = authRoutes;
