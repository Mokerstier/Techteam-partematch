const passport = require("passport");

function onLoginGet(req, res) {
	res.render("pages/login.ejs", {
		title: "Login"
	});
}
function onLoginPost(req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/profile",
		failureRedirect: "/login",
		failureFlash: true
	})(req, res, next);
}

function onRegister(req, res) {
	res.render("pages/register.ejs", {
		title: "Register"
	});
}

function onLogout(req, res, next) {
	if (req.session) {
		// check if a session is active
		// delete session object
		req.session.destroy(err => {
			if (err) {
				return next(err);
			}
			return res.redirect("/");
		});
	}
}

module.exports = { onLoginGet, onLoginPost, onRegister, onLogout };
