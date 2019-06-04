const mongoose = require('mongoose');

const prefSchema = new mongoose.Schema({
    pref: String,
    looking: String

});

exports.prefSchema = mongoose.model('prefs', prefSchema);