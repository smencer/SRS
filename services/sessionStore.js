var sessionTimeout = 20; //20 minutes

var sessionStore = {
    init: function(){
        setInterval(this.clearExpiredSessions.bind(this), sessionTimeout * 1000 * 60) ;
    },
    activeSessions: {},
    clearExpiredSessions: function(){
        for(var sessionKey in this.activeSessions){
            if(this.activeSessions.hasOwnProperty(sessionKey)){
                if(this.activeSessions[sessionKey].expiration > new Date()){
                    delete this.activeSessions[sessionKey];
                }
            }
        }
    },
    createSession: function(sessionKey){
        var initDate = new Date();

        var expiration = new Date();
        var minutes = expiration.getMinutes() + 20;
        expiration.setMinutes(minutes);

        this.activeSessions[sessionKey] = {
            activated: initDate,
            expiration: expiration
        };
        return sessionKey;
    },
    keepSesssionAlive: function(sessionKey){
        if(this.activeSessions.hasOwnProperty(sessionKey)){
            var timeout = activeSessions[sessionKey].lastAction.getMinutes() + sessionTimeout;
            if(timeout > new Date().getMinutes()){
                return false;
            } else {
                activeSessions[sessionKey].lastAction = new Date();
                return true;
            }
        } else {
            return false;
        }
    },
    endSession: function(sessionKey){
        if(this.activeSessions.hasOwnProperty(sessionKey)){
            delete this.activeSessions[sessionKey];
            return true;
        } else{
            return false;
        }
    }
};

module.exports = sessionStore;
