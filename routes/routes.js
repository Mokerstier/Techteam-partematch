
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
    const multer = require('multer');
    const path = require('path');
    
    //Storage uploads
    const uploads = multer.diskStorage({
        destination: './public/uploads/',
        filename: (req, file, cb) =>{
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    // Init upload
    const upload = multer({
        storage: uploads,
        fileFilter: (req, file, cb) => {
            checkFileType(file, cb);
        }
    }).single('userImage');

    //check filetype for uploads
    function checkFileType(file, cb){
        // allowed extensions
        const filetypes = /jpeg|jpg|png|gif/;
        // check extensions
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        //chekc mime
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname){
            return cb(null,true);
        } else {
            cb('Error: images only');
        }
    }

    function lookForMatch(req, res, next){
        const user_id = req.session.passport.user;
        const userfilter = userSchema.findOne({_id:user_id}, (err, doc) =>{
            if (!doc){
                res.redirect('/profile')
            
            } else 
            var filter = doc.events.festival;
            console.log(`this are the filteroptions '${filter}'`)    
                return next();
    })};

    async function whoThisUser(req, res, next) {
        const user_id = req.session.passport.user;
        userSchema.findOne({ _id: user_id }, (err, thisUser) => {
            if (err){
                res.send('something broke who this ', thisUser.firstName)
            } 
            else{
                console.log(thisUser);
                return next(thisUser);  
                
            } 
        })
    }

    function isLoggedIn(req, res, next) {
        // check if user is logged in with passport
        if (req.isAuthenticated()) {
            return next();
        } else
            res.redirect('/login');
    }
    // Route to homepage
    exRoutes.get("/", (req, res) => {
        res.render('pages/splash.ejs', {
            title: "partEmatch",
        });
    });
    //Route to match when logged in
    exRoutes.get('/match', isLoggedIn, lookForMatch, (req, res) => {
        //console.log(`now attempting search for match ${filter}`)
        userSchema.find({'events.festival':'lowlands'} , (err, users) => {
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
    exRoutes.get('/user/:id', isLoggedIn, (req, res, next) => {
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
    exRoutes.post('/upload', (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                res.redirect('/settings', {
                    msg: err,                 
                });
            } else {
                if (req.file == undefined) {
                    res.redirect('/settings', {                    
                        msg: 'Error: no file selected!',                      
                    });
                } else{
                    console.log(req.user)
                    res.redirect('/settings',{
                        msg: 'File uploaded',
                        file: `uploads/${req.file.filename}`                        
                    })
                }
            }
        })
    })
    //Route to login
    exRoutes.get('/login', (req, res) => {
        res.render('pages/login.ejs', {
            title: 'Login'
        })
    })
    exRoutes.post('/login', (req, res, next) => {

        passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    });
    // Route to register page
    exRoutes.get('/register', (req, res) => {
        res.render('pages/register.ejs', {
            title: 'Register'
        });
    });
    exRoutes.get('/logout', (req, res, next) => {
        if (req.session) { //check if a session is active
            // delete session object
            req.session.destroy( (err) => {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    });
    // Route to profile
    exRoutes.get('/profile', isLoggedIn,  (req, res, err) => {
        // if (err) {
        //     res.send(`say whut ${err}`)
        // } else {
        //     const thisUser = JSON.parse(thisUser)
        //     console.log('succes')
        //     res.render('pages/profile.ejs', {
        //         title : `Partematch profile`,
        //         username : camelCase(thisUser.firstName, { pascalCase: true })+ camelCase(thisUser.lastName, { pascalCase: true }),
        //         festival : thisUser.events.festival,
        //         dob : thisUser.dob,
        //         bio : thisUser.bio,
        //         imgUrl : thisUser.img.url
        //     });
        // }
        const user_id = req.session.passport.user
        userSchema.findOne({ _id: user_id }, (err, user) => {
            if (err) throw err

            res.render('pages/profile.ejs', {
                title: `Partematch ${user.firstName} profile`,     
                username: camelCase(user.firstName, { pascalCase: true }, user.lastName, { pascalCase: true }),
                festival: user.events.festival,
                dob: user.dob,
                bio: user.bio,
                imgUrl: user.img.url,
            });
        })
    });
    //Route to preferences
    exRoutes.get('/prefs', isLoggedIn, (req, res) => {

        res.render('pages/prefs.ejs', {
            title: 'Prefs'
        });
    });
    exRoutes.post('/prefs', isLoggedIn, urlencodedParser, (req, res) => {
        const user_id = req.session.passport.user;
        userSchema.findOne({ _id: user_id }, (err, user) => {
            console.log("hallo", user.firstName)
            if (err) throw err;
            user.prefs.create({
                pref: req.body.pref,
                looking: req.body.looking
            });
            console.log(user.prefs)
            user.save( (err) => {
                if (err) throw err;
            });
        })
        res.redirect('/profile');
    });
    // route to settings
    exRoutes.get('/settings', isLoggedIn, (req, res) => {
        res.render('pages/settings.ejs',{
            title: 'Change your settings'
        });
    });
    exRoutes.post('/settings', isLoggedIn, urlencodedParser, (req, res) => {
        const user_id = req.session.passport.user;
        userSchema.findOne({ _id: user_id }, async (err, doc) => {
            if(err) throw err
            console.log(doc)
                doc.gender = req.body.gender,
                doc.dob = req.body.dob,
                doc.location = req.body.location,
                doc.bio = req.body.bio;
            
            await doc.save();
            res.redirect('/profile');
        });
    });
    // Route to adding festivals
    exRoutes.get("/addevent", isLoggedIn,  (req, res) => {
        res.render('pages/addevent.ejs', {
            title: "Addevent"
        });
    });
    exRoutes.post('/addevent-succes', isLoggedIn, (req, res) => {
        const user_id = req.session.passport.user;
        userSchema.findOne({ _id: user_id }, async (err, doc) => {
            if(err) throw err
            doc.events.festival = req.body.festival;
            console.log(doc.events);
            await doc.save();
            res.redirect('/profile');
        });
    });
    // DANGER DELETE ACCOUNT
    exRoutes.post('/delete', isLoggedIn, (req,res) => {
        const user_id = req.session.passport.user;
        userSchema.findOneAndDelete({ _id: user_id }, async (err, doc) => {
            if(err) throw err
            res.redirect('/');
        });
    });
    // 404 pages invalid url or page doesnt exist
    exRoutes.use( (req, res, next) => {
        res.status(404).render('pages/404.ejs', {
            title: "Sorry, page not found"
        });
    });

    return exRoutes;

};

exports.routes = routes();