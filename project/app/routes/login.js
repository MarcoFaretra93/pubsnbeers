var express = require('express');
var router = express.Router();
var userValidator = require ('../helpers/userValidator')

/* GET login page. */
router.get('/', function(req, res) {
    res.render('login');
});

/* POST login user */
router.post('/', function(req, res) {
    userValidator.validateAuth(req.body.username, req.body.password, function(error, token){
        if (token) {
            res.cookie('PNB_token', token, {maxAge: 30000});
            res.redirect('/');
        } else {
            res.render('login', {error: error ? error : "User not found"});
        }
    });
});

module.exports = router;
