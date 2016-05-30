var middleware = function(req, res, next) {
    req.api = true;
    next();
}

module.exports = middleware;
