var mongoose = require('mongoose');
// var Beer = require('./beer');

var entryMenuSchema = mongoose.Schema({
    beer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Beer'
    },
    price: Number,
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }
});

var entryMenu = mongoose.model('EntryMenu', entryMenuSchema);

module.exports = entryMenu;
