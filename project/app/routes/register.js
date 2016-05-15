var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
var userRepo = require('../repositories/userRepo');


/* GET register page. */
router.get('/', function(req, res) {
    res.render('register');
});

/* POST register user */
router.post('/', function(req, res) {
    userRepo.registerNewUser(req.body.username, req.body.password, req.body.name, function(error, user){
        if (error) {
            res.render('register', {error: 'username already in use'}); //TODO gestire errore con codice
        } else if (user){
            res.redirect('/login');
        }
    });
});

module.exports = router;
