var menuModel = require('../models/menu');
var entryMenuRepo = require('./entryMenuRepo');
var async = require('async');

module.exports = {

    persist: function(beers, cb) {
        var newMenu = new menuModel({
            beers: beers
        });
        newMenu.save(function(err) {
            cb(err, newMenu);
        });
    },

    deleteMenu: function(id, cb){
        entryMenuRepo.deleteEntryByMenuId(id, function(err, record) {
            if(!err){
                menuModel.findByIdAndRemove(id, function(err, record) {
                    cb(err, record);
                });
            }
        });
    },

    insertBeers: function(menu, beers, cb) {
        var beers_id = Object.keys(beers);
        async.each(beers_id, function(beer_id, callback) {
            entryMenuRepo.isNewEntryMenu(beer_id, menu._id, function(isNew){
                if(isNew) {
                    entryMenuRepo.persist(beer_id, beers[beer_id], menu._id, function(err, entry){
                        menu.beers.push(entry._id);
                        callback(err);
                    });
                } else {
                    entryMenuRepo.changeBeerPrice(beer_id, menu._id, beers[beer_id], function (err) {
                        callback(err);
                    });
                }
            });
        }, function(){
            menu.save(function(err){
                cb(err);
            });
        });
    },

    removeBeer: function(idMenu, idBeer, cb) {
        menuModel.findOne({_id: idMenu}, function(err, menu) {
            entryMenuRepo.getIdEntry(idBeer, function(entries) {
                for(var i = 0; i<entries.length; i++) {
                    if(menu.beers.indexOf(entries[i]._id) !== -1) {
                        entryMenuRepo.removeEntry(entries[i]._id, function() {});
                        menu.beers.splice(menu.beers.indexOf(entries[i]._id),1);
                        menuModel.update({_id:idMenu}, {$set: {beers: menu.beers}}, function() {});
                    }
                }
            });
            cb();
        });
    },

    findAll: function(cb) {
        menuModel.find({}, function(err, beers){
            cb(err, beers);
        });
    },

    removeEntriesFromMenus: function (id_array) {
        async.each(id_array, function (entry_id, callback) {
            menuModel.findById(entry_id.menu, function(err, menu) {
                if(menu.beers.indexOf(entry_id._id) !== -1) {
                    menu.beers.splice(menu.beers.indexOf(entry_id._id),1);
                    menu.save(function(err,result){
                    });
                }
            });
            callback();
        })
    },

    getIdsOfBeers: function(menu, cb) {
        beers_id = [];                                      //vedi doc async
        async.each(menu.beers, function(entry_id, callback){   //menu.beers e il mio id_array, entry_id e' id_array[i]
            entryMenuRepo.getIdBeer(entry_id, function(err, beer_id){
                beers_id.push(beer_id.toString());              //qui dentro salvo
                callback(err);
            });
        }, function(){
            cb(beers_id);
        });
    },

    getBeers: function (idMenu, cb) {
        var beers=[];
        menuModel.findById(idMenu, function (err, entryMenus) {
            entryMenus.beers.forEach(function (entry) {
                entryMenuRepo.getBeerWithPrice(entry, function (err, beer) {
                    beers.push(beer);
                })
            })
            cb(err, beers);
        })

    }

}
