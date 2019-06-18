function routes() {
	const passport = require("passport");
	const session = require("express-session");
	const LocalStrategy = require("passport-local");
	const exRoutes = require("express").Router();
	const login = require("../controllers/user-login");
	const { userSchema } = require("../models/user");
	const { getNoti } = require("../controllers/getNotiData");
	const {
		getEvents,
		getEventById,
		getEventsByKeywords
	} = require("../controllers/getEventData");
	const user = require("../controllers/users");
	const camelCase = require("camelcase");
	const bodyParser = require("body-parser");
	const urlencodedParser = bodyParser.urlencoded({ extended: true });
	const multer = require("multer");
	const path = require("path");
	const isLoggedIn = require("../controllers/loggedin");
	const changePassword = require("../controllers/change-password");
	const fs = require("fs");

	// Storage uploads
	const uploads = multer.diskStorage({
		destination: "./public/uploads/",
		filename: (req, file, cb) => {
			cb(
				null,
				file.fieldname + "-" + Date.now() + path.extname(file.originalname)
			);
		}
	});
	// Init upload
	const upload = multer({
		storage: uploads,
		fileFilter: (req, file, cb) => {
			checkFileType(file, cb);
		}
	}).single("userImage");

	// check filetype for uploads
	function checkFileType(file, next) {
		// allowed extensions
		const filetypes = /jpeg|jpg|png|gif/;
		// check extensions
		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		// chekc mime
		const mimetype = filetypes.test(file.mimetype);

		if (mimetype && extname) {
			return next(null, true);
		} else {
			next("Error: images only");
		}
	}
	// Route to profile
	let thisUser = (req, res, next) => {
		const user_id = req.session.passport.user;
		userSchema.findOne({ _id: user_id }, (err, data) => {
			if (err) {
				res.send("something broke who this ", data.firstName);
			} else {
				thisUser = JSON.stringify(data);
				return next();
			}
		});
	};
	exRoutes.get("/profile", isLoggedIn, thisUser, (req, res) => {
		const data = JSON.parse(thisUser);
		console.log(data);
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
	});

	let genderMatch = (req, res, next) => {
		const user_id = req.session.passport.user;
		userSchema.findOne({ _id: user_id }, (err, doc) => {
			if (err) {
				res.redirect("/profile");
			} else genderMatch = doc.prefs.pref;

			return next(null, genderMatch);
		});
	};
	// Matching logic based on festival
	let festivalMatch = (req, res, next) => {
		const user_id = req.session.passport.user;
		userSchema.findOne({ _id: user_id }, (err, doc) => {
			if (err) {
				res.redirect("/profile");
			} else festivalMatch = doc.events;
			return next(null, festivalMatch);
		});
	};
	let relationMatch = (req, res, next) => {
		const user_id = req.session.passport.user;
		userSchema.findOne({ _id: user_id }, (err, doc) => {
			if (err) {
				res.redirect("/profile");
			} else relationMatch = doc.prefs.relation;
			return next(null, relationMatch);
		});
	};

	// Route to match when logged in and with matchingLogic based on festival
	exRoutes.get("/match", isLoggedIn, thisUser, festivalMatch, genderMatch, relationMatch, (req, res) => {
		const data = JSON.parse(thisUser);
		console.log(genderMatch == data.gender)
		let matches;

		// User looking for friends
		if (relationMatch == 'friend') {
			if (genderMatch == data.gender) {
				console.log(data.gender, 'looking for', relationMatch)// same sex
				userSchema.find({
					_id: { $ne: data._id },
					events : { $in: festivalMatch },
					'prefs.relation': {$eq: relationMatch}
				}, (err, users) => {
					if (err) throw err;
					console.log(`we found you ${users.length} matches`);
					console.log(users);
					matches = users;
				});
			} else {
				console.log(data.gender, ' looking for ', relationMatch)
				userSchema.find({
					_id: { $ne: data._id },
					events : { $in: festivalMatch },
					'prefs.relation': 'friend'
				}, (err, users) => {
					if (err) throw err;
					console.log(`we found you ${users.length} matches`);
					console.log(users);
					matches = users;
				})
			};
			// User looking for love
		} else if (relationMatch == 'love') {
			if (genderMatch == data.gender) {
				console.log(data.gender, ' looking for ', relationMatch) // same sex
				userSchema.find({
					_id: { $ne: data._id },
					gender: { $in: data.gender },
					events: { $in: festivalMatch },
					'prefs.relation': {$eq: relationMatch}
				}, (err, users) => {
					if (err) throw err;
					console.log(`we found you ${users.length} matches`);
					console.log(users);
					matches = users;
				});
			} else {
				console.log(data.gender, ' looking for ', relationMatch) // other sex
				userSchema.find({
					_id: { $ne: data._id },
					gender: {$ne: data.gender}, 
					events: { $in: festivalMatch },
					'prefs.relation': {$eq: relationMatch}
				},(err, users) => {
					if (err) throw err;
					matches = users;
					console.log(matches)
					console.log(`we found you ${users.length} matches`);
					res.render('pages/index.ejs', {
						user: matches,
						title: 'Find a match'
					});

				});
			}
		}
		
	});
	

	// Route to homepage
	exRoutes.get("/", (req, res) => {
		res.render("pages/splash.ejs", {
			title: "partEmatch"
		});
	});

	// Route to other user profile
	exRoutes.get("/user/:id", isLoggedIn, (req, res, next) => {
		let id = req.params.id;
		console.log(id);

		userSchema.findById({ _id: id }, (err, user) => {
			if (err) return next(err);
			getEventById(user.events.join("&id=")).then(eventObjects => {
				user.eventObjects = eventObjects;
				return res.render("pages/user.ejs", {
					user: user,
					title: user.firstName + " PartEmatch",
					username: camelCase(
						user.firstName,
						{ pascalCase: true },
						user.lastName,
						{ pascalCase: true }
					)
				});
			});
		});
	});
	// Route to login
	exRoutes.get("/login", (req, res) => {
		res.render("pages/login.ejs", {
			title: "Login"
		});
	});
	exRoutes.post("/login", (req, res, next) => {
		passport.authenticate("local", {
			successRedirect: "/profile",
			failureRedirect: "/login",
			failureFlash: true
		})(req, res, next);
	});
	// Route to register page
	exRoutes.get("/register", (req, res) => {
		res.render("pages/register.ejs", {
			title: "Register"
		});
	});
	exRoutes.get("/logout", (req, res, next) => {
		if (req.session) {
			// check if a session is active
			// delete session object
			req.session.destroy(err => {
				if (err) {
					return next(err);
				} else {
					return res.redirect("/");
				}
			});
		}
	});
	// Route to preferences
	exRoutes.get("/prefs", isLoggedIn, (req, res) => {
		res.render("pages/prefs.ejs", {
			title: "Prefs"
		});
	});
	exRoutes.post(
		"/prefs",
		isLoggedIn,
		urlencodedParser,
		thisUser,
		(req, res) => {
			const data = JSON.parse(thisUser);
			userSchema.findById({ _id: data._id }, (err, user) => {
				if (err) throw err;
				else {
					user.prefs.pref = req.body.pref;
					user.prefs.relation = req.body.relation;
					console.log(user);
					user.save();
				}
			});

			res.redirect("/profile");
		}
	);
	// route to settings
	exRoutes.get("/settings", isLoggedIn, (req, res) => {
		res.render("pages/settings.ejs", {
			title: "Verander je instellingen",
			message: ""
		});
	});
	exRoutes.post("/settings", isLoggedIn, urlencodedParser, (req, res) => {
		const user_id = req.session.passport.user;
		userSchema.findOne({ _id: user_id }, async (err, doc) => {
			if (err) throw err;
			console.log(doc);
			doc.gender = req.body.gender;
			doc.dob = req.body.dob;
			doc.location = req.body.location;
			doc.bio = req.body.bio;

			await doc.save();
			res.redirect("/profile");
		});
	});

	exRoutes.post("/upload", (req, res) => {
		const user_id = req.session.passport.user;
		upload(req, res, err => {
			if (err) {
				res.redirect("/settings", {
					msg: err
				});
			} else {
				if (req.file === undefined) {
					res.redirect("/settings", {
						msg: "Error: no file selected!"
					});
				} else {
					userSchema.findOne({ _id: user_id }, async (err, doc) => {
						if (err) throw err;
						let oldimg = doc.img;

						if (oldimg == "") {
							doc.img = req.file.filename;
							await doc.save();
							console.log("Toegevoegd als nieuwe PF");
						} else {
							fs.unlink("public/uploads/" + oldimg, err => {
								if (err) throw err;
							});
							doc.img = req.file.filename;
							await doc.save();
							console.log("vervangen");
						}
						res.redirect("/profile", 200, {
							msg: "File uploaded",

							file: `uploads/${req.file.filename}`
						});
					});
				}
			}
		});
	});
	// Route to notifications
	exRoutes.get("/notifications", isLoggedIn, thisUser, (req, res) => {
		getNoti().then(noti => {
			const data = { title: `${noti.length} new messages`, noti };
			console.log(noti);
			res.render("pages/notifications.ejs", data);
		});
	});
	exRoutes.post("/searchEvent", isLoggedIn, (req, res) => {
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
	});
	exRoutes.get("/getEvents/:query", (req, res) => {
		keywords = req.params.query;
		console.log(keywords);
		getEventsByKeywords(keywords).then(events => {
			console.log(events);
			res.json(events);
		});
	});
	// Route to adding festivals
	exRoutes.get("/addevent", isLoggedIn, (req, res) => {
		getEvents().then(events => {
			const data = { title: "Add event", events };
			res.render("pages/addevent.ejs", data);
		});
	});

	exRoutes.post("/addevent", isLoggedIn, (req, res) => {
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
	});
	exRoutes.post("/removeEvent", isLoggedIn, (req, res) => {
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
	});
	// DANGER DELETE ACCOUNT
	exRoutes.post("/delete", isLoggedIn, (req, res) => {
		const user_id = req.session.passport.user;
		userSchema.findOneAndDelete({ _id: user_id }, async (err, doc) => {
			if (err) throw err;
			res.redirect("/");
		});
	});
	exRoutes.post("/changePassword", isLoggedIn, changePassword);
	// 404 pages invalid url or page doesnt exist
	exRoutes.use((req, res, next) => {
		res.status(404).render("pages/404.ejs", {
			title: "Sorry, page not found"
		});
	});

	return exRoutes;
}

exports.routes = routes();
