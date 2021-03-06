const { userSchema } = require("../../models/user");
const { getEventById } = require("../getEventData");
const camelCase = require("camelcase");

function thisUser(req, res, next) {
	const user_id = req.session.passport.user;
	userSchema.findOne({ _id: user_id }, (err, data) => {
		if (err) {
			res.send("something broke who this ", data.firstName);
		} else {
			thisUser = JSON.stringify(data);
			return next(null, thisUser);
		}
	});
}
function onProfile(req, res) {
	const data = JSON.parse(thisUser);
	getEventById(data.events.join("&id=")).then(eventObjects => {
		data.eventObjects = eventObjects;
		res.render("pages/profile.ejs", {
			user: data,
			title: `Partematch profile ${data.firstName} `,
			username: `${camelCase(data.firstName, {
				pascalCase: true
			})} ${camelCase(data.lastName, { pascalCase: true })}`
		});
	});
}
function onUser(req, res, next) {
	let id = req.params.id;
	console.log(id);

	userSchema.findById({ _id: id }, (err, user) => {
		if (err) return next(err);
		getEventById(user.events.join("&id=")).then(eventObjects => {
			user.eventObjects = eventObjects;
			return res.render("pages/user.ejs", {
				user,
				title: `${user.firstName} PartEmatch`,
				username: camelCase(
					user.firstName,
					{ pascalCase: true },
					user.lastName,
					{ pascalCase: true }
				)
			});
		});
	});
}

module.exports = { thisUser, onProfile, onUser };
