var entryMenuModel = require('../models/entryMenu');
var beerRepo = require('./beerRepo');

module.exports = {

    persist: function(beer, price, menu_id, cb) {
        var newEntryMenu = new entryMenuModel({
            beer: beer,
            price: price,
            menu: menu_id
        });
        newEntryMenu.save(function(err) {
            cb(err, newEntryMenu);
        });
    },

    deleteEntryByMenuId: function(menu_id, cb){
        entryMenuModel.find({menu: menu_id}).remove().exec(function(err, record) {
            cb(err, record);
        });
    },

    isNewEntryMenu: function(beer, menu_id, cb) {
        entryMenuModel.findOne({beer:beer, menu:menu_id}, function(err, entry) {
            cb(!entry);
        });
    },

    changeBeerPrice: function(beer, menu, price, cb){
        entryMenuModel.findOne({beer: beer, menu: menu}, function(err, entry) {
            entry.price = price;
            entry.save(function(err){
                cb(err);
            });
        });
    },

    getIdBeer: function(entryMenuId, cb) {
        entryMenuModel.findOne({_id: entryMenuId}, function(err, entry) {
            cb(err, entry.beer);
        });
    },

    getIdEntry: function(idBeer, cb) {
        entryMenuModel.find({beer: idBeer}, function(err, result) {
            cb(result);
        });
    },

    removeEntry: function(idEntry, cb) {
        entryMenuModel.findByIdAndRemove({_id: idEntry}, function (err, result) {
            cb();
        });
    },

    removeBeerEntries: function (id, cb) {
        entryMenuModel.find({beer: id}, function (err, entries) {
            entryMenuModel.find({beer: id}).remove().exec(function(err, result) {
                cb(err, entries);
            });
        });
    },

    getBeer: function (idEntry, cb) {
        this.getIdBeer(idEntry, function (err, idbeer) {
            beerRepo.findBeerById(idbeer, function (err, beer) {
                cb(err, beer);
            })
        })
    },

    getBeerWithPrice: function (idEntry, cb) {
        var obj = {};
        this.getIdBeer(idEntry, function (err, idbeer) {
            beerRepo.findBeerById(idbeer, function (err, beer) {
                entryMenuModel.findOne({_id: idEntry}, function (err, entry) {
                    obj = {
                        _id: idbeer,
                        name: beer.name,
                        type: beer.type,
                        alcoholic_degree: beer.alcoholic_degree,
                        price: entry.price
                    };

                    cb(err, obj);
                })
            })
        })
    }

}
