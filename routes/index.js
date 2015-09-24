var authRoutes = require('./auth')
  configRoutes = require('./config');

var routes = {
    init: function(router, session){
        authRoutes.init(router, session);
        configRoutes.init(router, session);
    }
};

module.exports = routes;
