var urlLib = require('url');

var router = {
    templates: {
    },
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
        var parsed = urlLib.parse(request.url);
        return this.getRouteKey(request.method, parsed.pathname);
    },
    getRouteKey: function(method, url){
        return method + ':' + url;
    },
    checkForMatch: function(request){
        console.log(request.url);


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

module.exports = router;
