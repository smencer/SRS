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
        this.templates[this.getRouteKey(method, url)] = template;
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
        console.log(this.routes);
        this.routes[route](route, request, response);
    }
};

module.exports = router;
