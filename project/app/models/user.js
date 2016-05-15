var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, require: true, select: false},
    isAdmin: {type: Boolean, default: false}
});

userSchema.methods.isCorrectPsw = function(password){
    return bcrypt.compareSync(password, this.password);
}

var user = mongoose.model('User', userSchema);

module.exports = user;
