var express = require('express');
var router = express.Router();
var beerRepo = require('../repositories/beerRepo');
var entryMenuRepo = require('../repositories/entryMenuRepo');
var menuRepo = require('../repositories/menuRepo');

//Show all beers
router.get('/', function(req, res) {
    beerRepo.findAll(function(err, beers){
        if(req.headers.accept.toLowerCase() === "text/json") {
            res.status(200);
            res.send(beers);
        } else {
            res.render('beers', {
                result : beers,
                logged: req.cookies.PNB_token ? true : false
            });
        }
    });
});

router.post('/', function(req, res) {
    beerRepo.isNewBeer(req.body.name, req.body.type, req.body.alcoholic_degree, function(isNew) {
        if(isNew) {
            beerRepo.persist(req.body.name, req.body.type, req.body.alcoholic_degree, function(err, newBeer) {
                if (err) {
                    if (req.headers.accept.toLowerCase() === "text/json") {
                        res.status(500);
                        res.send({message: 'beer not inserted'});
                    } else {
                        res.redirect('/beers/create?error=beer%20not%20inserted');
                    }
                } else {
                    if(req.headers.accept.toLowerCase() === "text/json"){
                        res.status(201);
                        res.send(newBeer._doc);
                    } else {
                        res.redirect('/beers/create?message=beer%20inserted%20correctly');
                    }
                }
            });
        } else {
            if (req.headers.accept.toLowerCase() === "text/json") {
                res.status(409);
                res.send({message: 'beer already inserted'});
            } else {
                res.redirect('/beers/create?error=beer%20already%20inserted');
            }
        }
    });
});

router.get('/create', function(req, res) {
    res.render('newBeer',  {
        error: req.query.error,
        message: req.query.message
    });
});

router.get('/:id', function(req, res) {
    beerRepo.findBeerById(req.params.id, function (err, beer) {
        if(err || beer === null){
            if (req.headers.accept.toLowerCase() === "text/json") {
                res.status(404);
                res.send({message: 'beer not found'});
            } else {
                res.render('error', err);
            }
        } else {
            if (req.headers.accept.toLowerCase() === "text/json") {
                res.status(200);
                res.send(beer._doc);
            } else {
                res.render('infoBeer', beer);
            }
        }
    });
});

router.delete('/:id', function(req, res) {
    beerRepo.removeBeer(req.params.id, function (err, beer) {
        entryMenuRepo.removeBeerEntries(req.params.id, function(err, entries){
            menuRepo.removeEntriesFromMenus(entries);
            if (req.headers.accept.toLowerCase() === "text/json") {
                if (beer) {
                    res.status(200);
                    res.send(beer);
                } else {
                    res.status(404);
                    res.send({message: 'beer not found'});
                }
            } else {
                res.redirect('/beers');
            }
        });
    });
});

router.put('/:id', function(req, res) {
    beerRepo.isNewBeer(req.body.name, req.body.type, req.body.alcoholic_degree, function(isNew) {
        if(isNew) {
            beerRepo.updateBeer(req.params.id, req.body.name, req.body.type, req.body.alcoholic_degree, function (err, beer) {
                if (req.headers.accept.toLowerCase() === "text/json") {
                    res.status(200);
                    res.send(beer._doc);
                } else {
                    res.redirect('/beers/' + req.params.id + '/edit?message=beer%20updated');
                }
            });
        } else {
            if (req.headers.accept.toLowerCase() === "text/json") {
                res.status(409);
                res.send({message: 'beer already exists or not found'})
            } else {
                res.redirect('/beers/' + req.params.id + '/edit?error=beer%20already%20exists');
            }
        }
    });
});

router.get('/:id/edit', function(req, res) {
    beerRepo.findBeerById(req.params.id, function (err, beer) {
        res.render('editBeer', {beer: beer, message: req.query.message, error: req.query.error});
    });
});

module.exports = router;
