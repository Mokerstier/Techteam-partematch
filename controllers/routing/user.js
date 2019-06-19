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
			// console.log(thisUser);
			return next();
		}
	});
}
function onProfile(req, res) {
	console.log(thisUser);
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

module.exports = { thisUser, onProfile };
