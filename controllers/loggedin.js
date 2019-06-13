const passport = require('passport');
    const session = require('express-session');
    const LocalStrategy = require('passport-local');
    const exRoutes = require('express').Router();
    const login = require('../controllers/user-login');
    const { userSchema } = require('../models/user');
    const user = require('../controllers/users');
    const camelCase = require('camelcase');
    const bodyParser = require('body-parser');
    const urlencodedParser = bodyParser.urlencoded({ extended: true });
    const multer = require('multer');
    const path = require('path');

function isLoggedIn(req, res, next) {
    // check if user is logged in with passport
    if (req.isAuthenticated()) {
        return next();
    } else
        res.redirect('/login');
}
module.exports = {isLoggedIn} ;