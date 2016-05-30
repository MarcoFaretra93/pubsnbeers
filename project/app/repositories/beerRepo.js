var beerModel = require('../models/beer');

module.exports = {

    persist: function(name, type, alcoholic_degree, cb) {
        var newBeer = new beerModel({
            name: name,
            type: type,
            alcoholic_degree: alcoholic_degree
        });
        newBeer.save(function(err) {
            cb(err, newBeer);
        });
    },

    isNewBeer: function(name, type, alcoholic_degree, cb) {
        beerModel.findOne({name:name,type:type,alcoholic_degree:alcoholic_degree}, function(err, beer) {
            cb(!beer);
        })
    },

    findBeerById: function(id, cb) {
        beerModel.findById(id, function(err, beer){
            cb(err, beer);
        });
    },

    findBeerByIds: function(ids, cb) {
        beerModel.find({'_id': {$in : ids}}, function(err, beers) {
            cb(err, beers);
        });
    },

    updateBeer: function(id, name, type, degree, cb) {
        beerModel.findByIdAndUpdate(id, {$set: {name: name, type: type, alcoholic_degree: degree}}, {new: true }, function(err, beer) {
            cb(err, beer);
        });
    },

    findAll: function(cb) {
        beerModel.find({}, function(err, beers){
            cb(err, beers);
        });
    },

    getAllBeersIds: function(cb) {
        beerModel.find().select('_id').lean().exec(function(err, beers){
            beers = beers.map(function(beer){
                var beer_id = beer._id.toString();
                return beer_id;
            });
            cb(beers);
        });
    },

    removeBeer: function (id, cb) {
        beerModel.findByIdAndRemove(id, function (err, beer) {
            cb(err, beer);
        });
    }
}
