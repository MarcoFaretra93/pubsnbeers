var express = require('express');
var _ = require('underscore');
var router = express.Router();
var pubRepo = require('../repositories/pubRepo');
var beerRepo = require('../repositories/beerRepo');
var entryMenuRepo = require('../repositories/entryMenuRepo');
var menuRepo = require('../repositories/menuRepo');

//Find all di tutti i pub
router.get('/', function(req, res) {
    pubRepo.findAll(function (err, pubs) {
        if(err) res.send(err);
        res.render('pubs',
        {
            pubsresult: pubs
        });
    })
});

//Persist del nuovo pub
router.post('/', function(req, res) {
    pubRepo.isNewPub(req.body.name, req.body.location, function(isNew) {
        if(isNew) {
            pubRepo.persist(req.body.name, req.body.location, function(err, newPub) {
                if (err) {
                    res.redirect('/pubs/create?error=pub%20not%20inserted');
                } else {
                    res.redirect('/pubs/create?message=pub%20inserted%20correctly');
                }
            });
        }
        else {
            res.redirect('/pubs/create?error=pub%20already%20inserted');
        }
    });
});

router.get('/create', function(req, res) {
    res.render('newPub',  {
        error: req.query.error,
        message: req.query.message
    });
});

router.get('/:id', function(req, res) {
    pubRepo.findPubById(req.params.id, function(err, pub){
        if(err){
            res.render('error', err);
        }else{
            res.render('infoPub', pub);
        }
    })

});

//modifica dei dati di un pub--------------

router.put('/:id', function(req, res) {
    pubRepo.isNewPub(req.body.name, req.body.location, function(isNew){
        if(isNew){
            pubRepo.updatePub(req.params.id, req.body.name, req.body.location, function (err, pub) {
                res.redirect('/pubs/' + req.params.id + '/edit?message=pub%20updated')
            });
        }else{
            res.redirect('/pubs/' + req.params.id + '/edit?error=pub%20already%20exist');
        }
    });
});

router.get('/:id/edit', function(req, res) {
    pubRepo.findPubById(req.params.id, function (err, pub) {
        res.render('editPub', {pub: pub, message: req.query.message, error: req.query.error});
    })
});

//fine modifica ----------------------



router.delete('/:id', function(req, res) {
    pubRepo.deletePub(req.params.id, function(record){
        res.redirect('/pubs');
    });
});


router.get('/:id/beers', function(req, res) {
    pubRepo.getBeers(req.params.id, function (err, beers) {
        res.render('beersMenu',{
            err: err,
            idPub: req.params.id,
            result: beers
        });
    });

});



router.get('/:id/beers/insert', function(req, res) {
    beerRepo.findAll(function(err, beers){
        pubRepo.findBeerInserted(req.params.id, beers, function (inserted_ids) {
            beerRepo.getAllBeersIds(function(ids){
                beerRepo.findBeerByIds(_.difference(ids,inserted_ids), function(err, missing) {
                    res.render('insertBeerInMenu',{
                        pub_id: req.params.id,
                        result: missing,
                        message: req.query.message
                    });
                });
            });
        });
    });
});

router.post('/:id/beers/insert', function(req, res){
    pubRepo.retrieveMenu(req.params.id, function(err, menu){
        menuRepo.insertBeers(menu, beerId2PriceMap(req), function(err){
            if(!err){
                res.redirect('/pubs/' + req.params.id + '/beers/insert?message=beers%20inserted');
            }
        });
    });

});

router.delete('/:id/beers/:idBeer', function(req, res) {
    pubRepo.deleteBeer(req.params.id, req.params.idBeer, function() {
        res.redirect('/pubs/'+req.params.id+'/beers');
    });
});

router.get('/:id/beers/:idBeer', function(req, res) {
    beerRepo.findBeerById(req.params.idBeer, function(err, beer) {
        res.render('editBeerInMenu', {
            id: beer._id,
            name: beer.name,
            type: beer.type,
            alcoholic_degree: beer.alcoholic_degree,
            pubId: req.params.id,
            message: req.query.message
        });
    });
});

//modifica di una birra nel menu
router.put('/:id/beers/:idBeer', function(req, res) {
    pubRepo.findPubById(req.params.id, function(err, pub) {
        entryMenuRepo.changeBeerPrice(req.params.idBeer, pub.menu, req.body.price, function(err) {
            res.redirect('/pubs/'+req.params.id+'/beers');
        });
    });
});

var beerId2PriceMap = function(req){
    var result = {};
    if(typeof req.body.beers === 'string' || req.body.beers instanceof String) {
        result[req.body.beers] = req.body[req.body.beers];
    } else {
        req.body.beers.forEach(function (elem) {
            result[elem] = req.body[elem];
        });
    }
    return result;
}

module.exports = router;
