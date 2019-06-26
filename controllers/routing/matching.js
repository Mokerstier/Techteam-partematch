const { userSchema } = require("../../models/user");
let data;

function genderMatch(req, res, next) {
	const user_id = req.session.passport.user;
	userSchema.findOne({ _id: user_id }, (err, doc) => {
		if (err) {
			res.redirect("/profile");
		} else genderMatch = doc.prefs.pref;

		return next();
	});
}
// matching logic based on festival
function festivalMatch(req, res, next) {
	const user_id = req.session.passport.user;
	userSchema.findOne({ _id: user_id }, (err, doc) => {
		if (err) {
			res.redirect("/profile");
		} else festivalMatch = doc.events;
		return next();
	});
}
function relationMatch(req, res, next) {
	const user_id = req.session.passport.user;
	userSchema.findOne({ _id: user_id }, (err, doc) => {
		if (err) {
			res.redirect("/profile");
		} else relationMatch = doc.prefs.relation;
		data = doc;
		return next();
	});
}

function onMatching(req, res) {
	console.log(genderMatch == data.gender);
	let matches;

	// user looking for friends
	if (relationMatch == "friend") {
		if (genderMatch == data.gender) {
			console.log(data.gender, "looking for", relationMatch); // same sex
			userSchema.find(
				{
					_id: { $ne: data._id },
					events: { $in: festivalMatch },
					"prefs.relation": { $eq: relationMatch }
				},
				(err, users) => {
					if (err) throw err;
					console.log(`we found you ${users.length} matches`);
					console.log(users);
					matches = users;
					res.render("pages/index.ejs", {
						user: matches,
						title: "Find a match"
					});
				}
			);
		} else {
			console.log(data.gender, " looking for ", relationMatch);
			userSchema.find(
				{
					_id: { $ne: data._id },
					events: { $in: festivalMatch },
					// "prefs.relation": "friend"
				},
				(err, users) => {
					if (err) throw err;
					console.log(`we found you ${users.length} matches`);
					console.log(users);
					matches = users;
					res.render("pages/index.ejs", {
						user: matches,
						title: "Find a match"
					});
				}
			);
		}
		// user looking for love
	} else if (relationMatch == "love") {
		if (genderMatch == data.gender) {
			console.log(data.gender, " looking for ", relationMatch); // same sex
			userSchema.find(
				{
					_id: { $ne: data._id },
					gender: { $in: data.gender },
					events: { $in: festivalMatch },
					// "prefs.relation": { $eq: relationMatch }
				},
				(err, users) => {
					if (err) throw err;
					console.log(`we found you ${users.length} matches`);
					console.log(users);
					matches = users;
					res.render("pages/index.ejs", {
						user: matches,
						title: "Find a match"
					});
				}
			);
		} else {
			console.log(data.gender, " looking for ", relationMatch); // other sex
			userSchema.find(
				{
					_id: { $ne: data._id },
					gender: { $ne: data.gender },
					events: { $in: festivalMatch },
					// "prefs.relation": { $eq: relationMatch }
				},
				(err, users) => {
					if (err) throw err;
					matches = users;
					console.log(matches);
					console.log(`we found you ${users.length} matches`);
					res.render("pages/index.ejs", {
						user: matches,
						title: "Find a match"
					});
				}
			);
		}
	}
}

module.exports = { genderMatch, festivalMatch, relationMatch, onMatching };
