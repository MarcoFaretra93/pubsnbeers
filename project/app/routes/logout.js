var express = require('express');
var router = express.Router();
var userValidator = require ('../helpers/userValidator')

/* GET logout user */
router.get('/', function(req, res) {
    res.clearCookie('PNB_token');
    res.redirect('/');
});

module.exports = router;
