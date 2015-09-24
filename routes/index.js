var authRoutes = require('./auth');

var routes = {
    init: function(router, session){
        authRoutes.init(router, session);
    }
};

module.exports = routes;
