var userModel = require('../models/user');
var jwtConfig = require('../configs/JWT');
var userRepo = require('../repositories/userRepo');
var jwt = require('jsonwebtoken');



module.exports = {

        validateAuth: function(username, password, callback){
        userRepo.findUserByAttribute('username', username, '+password', function (error, user) {
            if(user && user.isCorrectPsw(password) ) {
                user._doc.password = ""; //pulizia password per il payload
                var token = jwt.sign(user._doc, jwtConfig.secret, {expiresIn: 60*15});
                callback(error, token);
            } else {
                callback(error, null);
            }
        });
    },

    isValidUser: function(token, callback){
        jwt.verify(token, jwtConfig.secret, function(err, decoded){
            callback(err, decoded);
        });
    },
}
