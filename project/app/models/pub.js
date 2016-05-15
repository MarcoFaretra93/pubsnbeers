var mongoose = require('mongoose');
// var Menu = require('./menu');

var pubSchema = mongoose.Schema({
    name: String,
    location: String,
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu'
    }
});

var pub = mongoose.model('Pub', pubSchema);

module.exports = pub;
