const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
	festival: [String],
	party: [String]
});

exports.eventSchema = mongoose.model('event', eventSchema);
