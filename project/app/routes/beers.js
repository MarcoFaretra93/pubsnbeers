var express = require('express');
var router = express.Router();
var beerRepo = require('../repositories/beerRepo');
var entryMenuRepo = require('../repositories/entryMenuRepo');
var menuRepo = require('../repositories/menuRepo');

//Show all beers
router.get('/', function(req, res) {
    beerRepo.findAll(function(err, beers){
        res.render('beers', {
            result : beers,
            logged: req.cookies.PNB_token ? true : false
        });
    });
});

router.post('/', function(req, res) {
    beerRepo.isNewBeer(req.body.name, req.body.type, req.body.alcoholic_degree, function(isNew) {
        if(isNew) {
            beerRepo.persist(req.body.name, req.body.type, req.body.alcoholic_degree, function(err, newBeer) {
                if (err) {
                    res.redirect('/beers/create?error=beer%20not%20inserted');
                } else {
                    res.redirect('/beers/create?message=beer%20inserted%20correctly');
                }
            });
        } else {
            res.redirect('/beers/create?error=beer%20already%20inserted');
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
        if(err){
            res.render('error',err);
        }else {
            res.render('infoBeer',beer);
        }
    });
});

router.delete('/:id', function(req, res) {
    beerRepo.removeBeer(req.params.id, function () {
        entryMenuRepo.removeBeerEntries(req.params.id, function(err, entries){
            menuRepo.removeEntriesFromMenus(entries);
            res.redirect('/beers');
        });
    });
});

router.put('/:id', function(req, res) {
    beerRepo.isNewBeer(req.body.name, req.body.type, req.body.alcoholic_degree, function(isNew) {
        if(isNew) {
            beerRepo.updateBeer(req.params.id, req.body.name, req.body.type, req.body.alcoholic_degree, function (err, beer) {
                res.redirect('/beers/' + req.params.id + '/edit?message=beer%20updated');
            });
        } else {
            res.redirect('/beers/' + req.params.id + '/edit?error=beer%20already%20exist');
        }
    });
});

router.get('/:id/edit', function(req, res) {
    beerRepo.findBeerById(req.params.id, function (err, beer) {
        res.render('editBeer', {beer: beer, message: req.query.message, error: req.query.error});
    });
});

module.exports = router;
