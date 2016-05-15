var pubModel = require('../models/pub');
var menuRepo = require('./menuRepo');

module.exports = {

    persist: function(name, location, cb) {
        menuRepo.persist([], function(err, newMenu) {
            var newPub = new pubModel({
                name: name,
                location: location,
                menu: newMenu._id
            });
            newPub.save(function(err) {
                cb(err, newPub);
            });
        });
    },

    isNewPub: function(name, location, cb) {
        pubModel.findOne({name: name, location:location}, function(err, pub) {
            cb(!pub);
        });
    },

    retrieveMenu: function(pub_id, cb) {
        pubModel.findById(pub_id).populate('menu').exec(function(err, pub) {
            cb(err,pub.menu);
        });
    },

    findAll: function (cb) {
        pubModel.find({}, function (err, pubs) {
            cb(err, pubs);
        })
    },

    findPubById: function(id, cb) {
        pubModel.findById(id, function(err, pub){
            cb(err, pub);
        });
    },

    deleteBeer: function(idPub, idBeer, cb) {
        pubModel.findOne({_id:idPub}, function(err, pub) {
            menuRepo.removeBeer(pub.menu, idBeer, function() {
                cb();
            });
        });
    },

    updatePub: function(id, name, location, cb) {
        pubModel.findByIdAndUpdate(id, {$set: {name: name, location: location}}, function(err, pub) {
            cb(err, pub);
        });
    },

    deletePub: function(id, cb){
        this.findPubById(id, function(err, pub){
            menuRepo.deleteMenu(pub.menu, function(err, record){
                if(!err) {
                    pubModel.findByIdAndRemove(id, function (err, record) {
                        cb(record);
                    });
                }
            });
        });
    },

    getBeers: function (idPub, cb) {
        this.findPubById(idPub, function (err, pub) {
            var idMenu = pub.menu;
            var beers = {};
            menuRepo.getBeers(idMenu, function (err, result) {
                beers = result;
                cb(err, beers);
            });

        });
    },

    findBeerInserted: function (pub_id, beers, cb) {
        this.retrieveMenu(pub_id, function(err, menu){
            menuRepo.getIdsOfBeers(menu, function(ids) {
                cb(ids);
            });
        })
    }

}
