const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');

const login = require('../controllers/user-login');
const { userSchema } = require('../models/user');

const camelCase = require('camelcase');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });


let thisUser = (req, res, next) => {
    const user_id = req.session.passport.user;
    userSchema.findOne({ _id: user_id }, (err, data) => {
        if (err) {
            res.send('something broke who this ', data.firstName)
        }
        else {
            thisUser = JSON.stringify(data)
            return next();
        }
    });
};
module.exports.thisUser = {thisUser};
