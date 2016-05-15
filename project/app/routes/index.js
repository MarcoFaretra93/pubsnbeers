var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: "Pubs'N'Beers",
        logged: req.cookies.PNB_token ? true : false  //TODO avere un token significa essere loggati???
    });
});

module.exports = router;
