var mongoose = require('mongoose');
var EntryMenu = require('./entryMenu');

var menuSchema = mongoose.Schema({
    beers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EntryMenu'
    }]
});

var menu = mongoose.model('Menu', menuSchema);

module.exports = menu;
