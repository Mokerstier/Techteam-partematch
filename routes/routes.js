
function routes () {
    const passport = require('passport');
    const session = require('express-session');
    const LocalStrategy = require('passport-local');
    const exRoutes = require('express').Router();
    const login = require('../controllers/user-login');
    const {userSchema} = require('../models/user');
    const user = require('../controllers/users');
    const camelCase = require('camelcase');

    function isLoggedIn(req, res, next) {
        console.log(`this is the session id ${req.session.id}`)
        // passport adds this to the request object
        if (req.isAuthenticated()) {
            
            return next();
        } else
        res.redirect('/login');
    }
    // Route to homepage
    exRoutes.get("/", function(req, res) {
        res.render('pages/splash.ejs' ,{
            title: "partEmatch",
        });
    });
    //Route to home when logged in
    exRoutes.get('/home', function(req, res){
        res.render('pages/index.ejs', {
            title: 'Find a match'
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
            successRedirect: '/profile',
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
    exRoutes.get('/profile', isLoggedIn, function(req, res){
        console.log(req.session.passport.user)
        const user_id = req.session.passport.user
        console.log(user_id)
        userSchema.findOne({_id: user_id}, function(err, user){
            
            res.render('pages/profile.ejs', { 
                title: `Hi ${user.firstName}`,
                username: camelCase(user.firstName, {pascalCase: true}),
                festival: ''
                });
        })
        
        
        
       
    });
    //Route to settings
    exRoutes.get('/settings', function (req, res) {
        if (req.user){
            res.render('pages/settings.ejs', {
                title: 'Settings'
            });
        } else {
            res.status(403);
        }
    });
    
    // Route to adding festivals
    exRoutes.get("/addevent", isLoggedIn, function(req, res){
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