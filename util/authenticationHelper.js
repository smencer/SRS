var crypto = require('crypto');

var authenticationHelper = {
    algorithm: 'aes-256-ctr',
    salt: 'salty',
    encrypt: function(text){
        var cipher = crypto.createCipher(this.algorithm, this.salt)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function(text){
        var decipher = crypto.createDecipher(this.algorithm, this.salt)
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
};

module.exports = authenticationHelper;
