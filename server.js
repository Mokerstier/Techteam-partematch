/* eslint-disable no-inline-comments */
/* eslint-disable capitalized-comments */
/* eslint-disable line-comment-position */
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const cookieParser = require("cookie-parser");
const passport = require("passport");
const flash = require("connect-flash");

// routes
const { routes } = require("./routes/routes");
// controllers
const user = require("./controllers/users");

require("dotenv").config();
require("./controllers/user-login")(passport);

const options = {
	useNewUrlParser: true,
	useFindAndModify: false,
	autoIndex: false, // Don't build indexes
	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0,
	connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
	socketTimeoutMS: 45000,
	family: 4 // Use IPv4, skip trying IPv6
};

// Settings for online DATABASE
var uri = process.env.MONGODB_URI;
const port = process.env.PORT;
const app = express();

mongoose.connect(uri, options);
mongoose.connection.on("open", function(err, doc) {
	console.log(`connection established with ${process.env.DB_NAME}`);
	if (err) throw err;
});

app
	.use(urlencodedParser)
	.use(express.static(__dirname, Number("/public")))
	.use(express.json())
	.use(cookieParser())
	.use(flash())
	.use("/register", user)
	.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false
		})
	)
	.use(passport.initialize())
	.use(passport.session())
	.use("/", routes)
	.set("view engine", "ejs")
	.set("trust proxy", 1); // used because not communicating over HTTPS and want to set cookie

app.listen(port, () => console.log(`server is gestart op port ${port}`));
