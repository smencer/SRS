var responseHelper = require('../util/responseHelper'),
                qs = require('querystring');

var session;

var authRoutes = {
    init: function(router, session){
        session = session;

        // Create
        router.registerRoute('POST', '/config', function(route, request, response){
        });
        
        // Retrieve
        router.registerRoute('GET', '/config', function(route, request, response){
        });

        // Update
        router.registerRoute('PUT', '/config', function(route, request, response){
        });
        
        // Delete
        router.registerRoute('DELETE', '/config', function(route, request, response){
        });   
    }
};

module.exports = authRoutes;
