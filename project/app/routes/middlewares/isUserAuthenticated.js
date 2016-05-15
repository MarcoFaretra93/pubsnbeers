var userValidator = require ('../../helpers/userValidator')

var middleware = function(req, res, next) {
    userValidator.isValidUser(req.cookies.PNB_token, function(err, token_payload){
        if (err) {
            res.clearCookie('PNB_token');
            res.redirect('/login');
        } else {
            next();
        }
    });
};

module.exports = middleware;
