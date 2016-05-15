var userModel = require('../models/user');
var bcrypt = require('bcrypt');

module.exports = {

    registerNewUser: function (username, password, name, callback) {
        var newUser = new userModel({
            username: username,
            password: bcrypt.hashSync(password, 10),
            name: name
        });
        newUser.save(function(error){
            callback(error, newUser);
        });
    },
    findUserByAttribute: function(attribute, value, additional_param, callback) {
        var query = {};
        query[attribute] = value;
        userModel.findOne(query).select(additional_param).exec(function (err, user) {
            callback(err, user);
        });
    }
}
