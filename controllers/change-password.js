const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongo = require("mongodb");
const express = require("express");
const session = require("express-session");
const { userSchema } = require("../models/user");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

module.exports = (req, res) => {
	const user_id = req.session.passport.user;
	console.log(`${user_id} is trying to change password`);
	const currentPass = req.body.currentPass;
	const newPass = req.body.newPass;
	userSchema.findOne({ _id: user_id }, async (err, doc) => {
		console.log(doc);
		if (err) throw err;
		try {
			bcrypt.compare(currentPass, doc.password, (err, authSucces) => {
				if (err) throw err;
				if (authSucces) {
					console.log(`${user_id} passwords matched`);
					bcrypt.hash(newPass, 10, async (err, hash) => {
						if (err) {
							console.log(err);
						}
						try {
							userSchema.updateOne(
								{ _id: user_id },
								{ $set: { password: hash } },
								async (err, doc) => {
									if (err) throw err;
									if (!doc) {
										console.log(
											`${user_id} pass change- Something went wrong while updating`
										);
										res.redirect("/settings", 200, {
											message: "Wrong password"
										});
									}
									console.log(`updated password ${user_id}`);
									res.redirect("/settings");
								}
							);
						} catch (err) {
							console.log(err);
						} finally {
							console.log("password change complete");
						}
					});
				} else {
					res.render("pages/settings.ejs", {
						title: "Verander je instellingen",
						message: "Verkeerde wachtwoord ingevoerd"
					});
				}
			});
		} catch (err) {
			console.log(err);
		} finally {
			console.log("password tried");
		}
	});
};
