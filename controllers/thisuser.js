const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');

const login = require('../controllers/user-login');
const { userSchema } = require('../models/user');

const camelCase = require('camelcase');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });



function getData(next) {
    console.log('function running')
    const user_id = req.session.passport.user;
    userSchema.findOne({ _id: user_id }, (err, data) => {
        next(err, res);
        if (err) {
            res.send('something broke who this '+ data.firstName)
        }
        else {

            console.log(data)
            userData = JSON.stringify(data)
            console.log(userData)
            
        }
        
    });
};
module.exports = { getData : getData }

