var mongoose = require('mongoose');

var beerSchema = new mongoose.Schema({
    name: String,
    type: String,
    alcoholic_degree: Number
});

var beer = mongoose.model('Beer', beerSchema);

module.exports = beer;
