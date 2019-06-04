
function routes() {
    const passport = require('passport');
    const session = require('express-session');
    const LocalStrategy = require('passport-local');
    const exRoutes = require('express').Router();
    const login = require('../controllers/user-login');
    const { userSchema } = require('../models/user');
    const { prefSchema } = require('../models/prefs');
    const user = require('../controllers/users');
    const camelCase = require('camelcase');
    const bodyParser = require('body-parser');
    const urlencodedParser = bodyParser.urlencoded({ extended: true });

    function lookForMatch(req, res, next){
        const user_id = req.session.passport.user;
        const userfilter = userSchema.findOne({_id:user_id}, (err, doc) =>{
            if (!doc){
                res.redirect('/profile')
            
            } else 
            var filter = doc.events.festival;
            console.log(`this are the filteroptions '${filter}'`)    
                return next();
    })}

    function isLoggedIn(req, res, next) {
        // check if user is logged in with passport
        if (req.isAuthenticated()) {

            return next();
        } else
            res.redirect('/login');

    }
    // Route to homepage
    exRoutes.get("/", function (req, res) {
        res.render('pages/splash.ejs', {
            title: "partEmatch",
        });
    });
    //Route to match when logged in
    exRoutes.get('/match', isLoggedIn, lookForMatch, function (req, res) {
        //console.log(`now attempting search for match ${filter}`)
        userSchema.find({'events.festival':'lowlands'}, function (err, users) {
            console.log(`we found you ${users.length} matches`)
            if (err) {
                res.send('something went terribly wrong')
            }
            res.render('pages/index.ejs', {
                user: users,
                title: 'Find a match'
            });
        });
        
    });
    //Route to other user profile
    exRoutes.get('/user/:id', isLoggedIn, function (req, res, next) {
        let id = req.params.id
        console.log(id)
        userSchema.findById({ _id: id }, (err, user) => {
            if (err) return next(err)
            return res.render('pages/user.ejs', {
                user: user,
                title: user.firstName + ' PartEmatch',
                username: camelCase(user.firstName, { pascalCase: true }, user.lastName, { pascalCase: true }),
                festival: user.events.festival,
                dob: user.dob,
                bio: user.bio,
                imgUrl: user.img.url,
            })
        });
    });
    //Route to login
    exRoutes.get('/login', function (req, res) {
        res.render('pages/login.ejs', {
            title: 'Login'
        })
    })
    exRoutes.post('/login', function (req, res, next) {

        passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    });
    // Route to register page
    exRoutes.get('/register', function (req, res) {
        res.render('pages/register.ejs', {
            title: 'Register'
        });
    });
    exRoutes.get('/logout', function (req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    });
    // Route to profile
    exRoutes.get('/profile', isLoggedIn, function (req, res) {

        const user_id = req.session.passport.user

        userSchema.findOne({ _id: user_id }, function (err, user) {
            if (err) throw err
            res.render('pages/profile.ejs', {
                title: `Hi ${user.firstName}`,
                username: camelCase(user.firstName, { pascalCase: true }, user.lastName, { pascalCase: true }),
                festival: user.events.festival,
                dob: user.dob,
                bio: user.bio,
                imgUrl: user.img.url,
            });
        })




    });
    // exRoutes.get('/profile', isLoggedIn, function(req, res){
    //     console.log(req.session.passport.user)
    //     const user_id = req.session.passport.user
    //     console.log(user_id)
    //     userSchema.findOne({_id: user_id}, function(err, user){

    //         res.render('pages/profile.ejs', { 
    //             title: `Hi ${user.firstName}`,
    //             username: camelCase(user.firstName, {pascalCase: true}),
    //             festival: ''
    //             });
    //     })   




    // });
    //Route to settings
    exRoutes.get('/prefs', isLoggedIn, function (req, res) {

        res.render('pages/prefs.ejs', {
            title: 'Prefs'
        });
    });
    exRoutes.post('/prefs', isLoggedIn, urlencodedParser, function (req, res) {

        const user_id = req.session.passport.user;
        userSchema.findOne({ _id: user_id }, function (err, user) {
            console.log("hallo", user.firstName)
            if (err) throw err;
            // let settings = req.body; 

            user.prefs.create({
                pref: req.body.pref,
                looking: req.body.looking
            });
            console.log(user.prefs)

            user.save(function (err) {
                if (err) throw err;

            });

        })
        res.redirect('/profile');
    });

    // Route to adding festivals
    exRoutes.get("/addevent", isLoggedIn, function (req, res) {
        res.render('pages/addevent.ejs', {
            title: "Addevent"
        });
    });
    exRoutes.get("/addevent-succes", function (req, res) {

        res.render('pages/addevent-succes.ejs', {

            title: "Succes",
            festival: req.query.festival
        });
    });
    exRoutes.use(function (req, res, next) {
        res.status(404).render('pages/404.ejs', {
            title: "Sorry, page not found"
        });
    });

    return exRoutes;

};

exports.routes = routes();