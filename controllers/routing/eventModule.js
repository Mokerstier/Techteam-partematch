const { userSchema } = require("../../models/user");
const { getEvents, getEventsByKeywords } = require("../getEventData");

function onSearchEvent(req, res) {
	if (req.body.query) {
		const keywords = req.body.query;
		getEventsByKeywords(keywords).then(events => {
			const data = { title: "Add event", events };
			console.log(data);
			res.render("pages/addevent.ejs", data);
		});
	} else {
		getEvents().then(events => {
			const data = { title: "Add event", events };
			res.render("pages/addevent.ejs", data);
		});
	}
}
function onGetEvents(req, res) {
	keywords = req.params.query;
	console.log(keywords);
	getEventsByKeywords(keywords).then(events => {
		console.log(events);
		res.json(events);
	});
}
function onAddEventGet(req, res) {
	getEvents().then(events => {
		const data = { title: "Add event", events };
		res.render("pages/addevent.ejs", data);
	});
}
function onAddEventPost(req, res) {
	const user_id = req.session.passport.user;
	userSchema.findOneAndUpdate(
		{ _id: user_id },
		{ $addToSet: { events: req.body.eventID } },
		async (err, doc) => {
			if (err) throw err;
			await doc.save();
			res.redirect("/profile");
		}
	);
}
function onRemoveEvent(req, res) {
	const user_id = req.session.passport.user;
	userSchema.findOneAndUpdate(
		{ _id: user_id },
		{ $pull: { events: req.body.eventID } },
		async (err, doc) => {
			if (err) throw err;
			console.log(`EVENTS: ${doc.events}`);
			await doc.save();
			res.redirect("/profile");
		}
	);
}

module.exports = {
	onAddEventGet,
	onAddEventPost,
	onGetEvents,
	onRemoveEvent,
	onSearchEvent
};
