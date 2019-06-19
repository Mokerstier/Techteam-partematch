const userSchema = require("../../models/user");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const uploads = multer.diskStorage({
	destination: "./public/uploads/",
	filename: (req, file, cb) => {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	}
});
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
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// chekc mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return next(null, true);
	}
	next("Error: images only");
}

function onPrefsGet(req, res) {
	res.render("pages/prefs.ejs", {
		title: "Prefs"
	});
}

function onPrefsPost(req, res) {
	const user_id = req.session.passport.user;
	userSchema.findById({ _id: user_id }, (err, user) => {
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

function onSettingsGet(req, res) {
	res.render("pages/settings.ejs", {
		title: "Verander je instellingen",
		message: ""
	});
}

function onSettingsPost(req, res) {
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
}

function onUpload(req, res) {
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
}
function onDelete(req, res) {
	const user_id = req.session.passport.user;
	userSchema.findOneAndDelete({ _id: user_id }, async (err, doc) => {
		if (err) throw err;
		res.redirect("/");
	});
}

module.exports = {
	onPrefsGet,
	onPrefsPost,
	onSettingsGet,
	onSettingsPost,
	onUpload,
	onDelete
};
