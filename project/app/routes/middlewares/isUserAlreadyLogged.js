var userValidator = require ('../../helpers/userValidator')

var middleware = function(req, res, next) {
    req.cookies.PNB_token ? res.redirect('/') : next();
};

module.exports = middleware;
