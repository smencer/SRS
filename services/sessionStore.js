var sessionTimeout = 5; // minutes

var sessionStore = {
    init: function(){
        this.activeSessions = {};
        setInterval(this.clearExpiredSessions.bind(this), sessionTimeout * 1000 * 60) ;
    },
    clearExpiredSessions: function(){
        console.log('clearing inactive sessions');
        for(var sessionKey in this.activeSessions){
            if(this.activeSessions.hasOwnProperty(sessionKey)){
                if(this.activeSessions[sessionKey].expiration > new Date()){
                    console.log('Removing session: ' + sessionKey);
                    delete this.activeSessions[sessionKey];
                }
            }
        }
    },
    createSession: function(sessionKey, user){
        var initDate = new Date();

        var expiration = this.getExpiration();
        
        this.activeSessions[sessionKey] = {
            activated: initDate,
            expiration: expiration,
            user: user
        };

        return sessionKey;
    },
    keepSessionAlive: function(sessionKey){
        if(this.activeSessions.hasOwnProperty(sessionKey)){
            if(this.activeSessions.expiration > new Date()){
                return false;
            } else {
                var newExpiration = this.getExpiration();
                this.activeSessions[sessionKey].expiration = newExpiration;
                console.log('Setting new expiration for [' + sessionKey + '] - ' + newExpiration);
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
    },
    getExpiration: function(){
        var expiration = new Date();
        var minutes = expiration.getMinutes() + sessionTimeout;
        expiration.setMinutes(minutes);
        return expiration;
    }
};

module.exports = sessionStore;
