
function routes () {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const exRoutes = require('express').Router();
    const login = require('../controllers/user-login');
    const userSchema = require('../models/user');
    
    // Route to homepage
    exRoutes.get("/", function(req, res) {
        res.render('pages/splash.ejs' ,{
            title: "partEmatch",
        });
    });
    
    // Route to login
    exRoutes.get('/login', function (req, res) {
        res.render('pages/login.ejs',{
            title: 'Login'
        })
    })
    exRoutes.post('/login', function(req, res, next){
        passport.authenticate('local', {
            successRedirect: '/settings',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    });
    // Route to register page
    exRoutes.get('/register', function(req, res) {
        res.render('pages/register.ejs' ,{
            title: 'Register'
        });
    });
    // Route to profile
    exRoutes.get('/profile', function(req, res){
        res.render('pages/profile.ejs', {
            title: 'Hi user',
            username: 'Wouter',
            festival: 'Psy-fi'
        })
    });
    //Route to settings
    exRoutes.get('/settings', function (req, res) {
        if ('/'){
            res.render('pages/settings.ejs', {
                title: 'Settings'
            });
        } else {
            res.status(403);
        }
    });
    
    // Route to adding festivals
    exRoutes.get("/addevent" , function(req, res){
        res.render('pages/addevent.ejs' ,{
            title: "Addevent"
        });
    });
    exRoutes.get("/addevent-succes", function(req, res){
        res.render('pages/addevent-succes.ejs',{
            title: "Succes",
            festival: req.query.festival
        });
    });
    exRoutes.use(function(req, res, next){
        res.status(404).render('pages/404.ejs', {
            title: "Sorry, page not found"
        });
    });

    return exRoutes;

};

exports.routes = routes();