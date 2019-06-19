function routes() {
	const {
		thisUser,
		onProfile,
		onUser
	} = require("../controllers/routing/user");
	const {
		festivalMatch,
		genderMatch,
		relationMatch,
		onMatching
	} = require("../controllers/routing/matching");
	const {
		onLoginGet,
		onLoginPost,
		onRegister,
		onLogout
	} = require("../controllers/routing/login");
	const {
		onSettingsGet,
		onSettingsPost,
		onPrefsGet,
		onPrefsPost,
		onUpload,
		onDelete
	} = require("../controllers/routing/settings");
	const {
		onAddEventGet,
		onAddEventPost,
		onGetEvents,
		onRemoveEvent,
		onSearchEvent
	} = require("../controllers/routing/eventModule");
	const exRoutes = require("express").Router();
	const bodyParser = require("body-parser");
	const urlencodedParser = bodyParser.urlencoded({ extended: true });
	const isLoggedIn = require("../controllers/loggedin");
	const changePassword = require("../controllers/change-password");

	// gET routes
	exRoutes
		.get("/profile", isLoggedIn, thisUser, onProfile)
		.get(
			"/match",
			isLoggedIn,
			thisUser,
			festivalMatch,
			genderMatch,
			relationMatch,
			onMatching
		)
		.get("/user/:id", isLoggedIn, onUser)
		.get("/login", onLoginGet)
		.get("/register", onRegister)
		.get("/logout", onLogout)
		.get("/prefs", isLoggedIn, onPrefsGet)
		.get("/getEvents/:query", onGetEvents)
		.get("/addevent", isLoggedIn, onAddEventGet)
		.get("/notifications", (req, res) => {
			res.render("pages/notifications.ejs", { title: "Notifications" });
		})
		.get("/", (req, res) => {
			res.render("pages/splash.ejs", {
				title: "partEmatch"
			});
		})
		.get("/settings", isLoggedIn, onSettingsGet);

	// pOST routes
	exRoutes
		.post("/login", onLoginPost)
		.post("/prefs", isLoggedIn, urlencodedParser, thisUser, onPrefsPost)
		.post("/settings", isLoggedIn, urlencodedParser, onSettingsPost)
		.post("/upload", onUpload)
		.post("/searchEvent", isLoggedIn, onSearchEvent)
		.post("/addevent", isLoggedIn, onAddEventPost)
		.post("/removeEvent", isLoggedIn, onRemoveEvent)
		.post("/delete", isLoggedIn, onDelete)
		.post("/changePassword", isLoggedIn, changePassword)
		.use((req, res, next) => {
			res.status(404).render("pages/404.ejs", {
				title: "Sorry, page not found"
			});
		});

	return exRoutes;
}

exports.routes = routes();
