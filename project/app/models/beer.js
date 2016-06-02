var mongoose = require('mongoose');

var beerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    alcoholic_degree: {type: Number, required: true}
});

var beer = mongoose.model('Beer', beerSchema);

module.exports = beer;
