
function routes() {
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

    function isLoggedIn(req, res, next) {
        // check if user is logged in with passport
        if (req.isAuthenticated()) {
            return next();
        } else
            res.redirect('/login');
    }
    // Route to profile
    let thisUser = ( req, res, next) => {
        const user_id = req.session.passport.user;        
        userSchema.findOne({ _id: user_id }, (err, data) => {
            if (err){
                res.send('something broke who this ', data.firstName)
            } 
            else{              
                thisUser = JSON.stringify(data)
                return next();  
            } 
        });
    };
    exRoutes.get('/profile', isLoggedIn, thisUser, (req, res) => {
        const data = JSON.parse(thisUser)
        res.render('pages/profile.ejs', {
            user: data,
            title: `Partematch profile ${data.firstName} `,
            username: `${camelCase(data.firstName, { pascalCase: true })} ${camelCase(data.lastName, { pascalCase: true })}`
        })
    });
    let genderMatch = (req, res, next) => {
        const user_id = req.session.passport.user;
        userSchema.findOne({_id:user_id}, (err, doc) =>{
            if (!doc){
                res.redirect('/profile')
                
            } else 
                genderMatch = doc.prefs.pref;
                console.log(genderMatch) 

                return next(null, genderMatch)
    })};
    // Matching logic based on festival
    let festivalMatch = (req, res, next) => {
        const user_id = req.session.passport.user;
        userSchema.findOne({_id:user_id}, (err, doc) =>{
            if (!doc){
                res.redirect('/profile')
                
            } else 
                festivalMatch = doc.events.festival;                                       
                return next(null, festivalMatch)
    })};
    let relationMatch = (req, res, next) => {
        const user_id = req.session.passport.user;
        userSchema.findOne({_id:user_id}, (err, doc) =>{
            if (!doc){
                res.redirect('/profile')
                
            } else 
                gender = doc.gender
                relationMatch = doc.prefs.relation;                                       
                return next(null, relationMatch)
    })};
    //Route to match when logged in and with matchingLogic based on festival
    exRoutes.get('/match', isLoggedIn, thisUser, festivalMatch, genderMatch, relationMatch, (req, res) => {
        const data = JSON.parse(thisUser)
    
        // User looking for all kind of relations <3 in both sexes
        if (genderMatch == 'nopref' && relationMatch == 'nopref'){
            console.log (`I'm a ${data.gender}, looking for ${genderMatch} people who are attending ${data.events.festival}`)
            userSchema.find({
                '_id': {$ne: data._id},
                'prefs.pref':{ $in: [data.gender, 'nopref'] }, 
                'events.festival':{ $in: festivalMatch } 
                }, (err, users) =>{
                console.log(`we found you ${users.length} matches`)
                console.log(users)
                res.render('pages/index.ejs', {
                    user: users,
                    title: 'Find a match'
                });  
            })
        }
        // User looking for friends of both sexes
        else if (genderMatch == 'nopref' && relationMatch == 'friend'){
            console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that want to become friends and are attending ${data.events.festival}`)
            userSchema.find({
                '_id': {$ne: data._id},
                'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
                'prefs.relation':{ $in: ['nopref','friend'] },
                'events.festival':{ $in: festivalMatch }   
                }, (err, users) =>{
                console.log(`we found you ${users.length} matches`)
                console.log(users)
                res.render('pages/index.ejs', {
                    user: users,
                    title: 'Find a match'
                });  
            })     
        }
        // User looking for love with all sexes
        else if (genderMatch == 'nopref' && relationMatch == 'love'){
            console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that want to become friends and are attending ${data.events.festival}`)
            userSchema.find({
                '_id': {$ne: data._id},
                'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
                'events.festival':{ $in: festivalMatch }, 
                'prefs.relation':{ $in: ['nopref','love']} 
                }, (err, users) =>{
                console.log(`we found you ${users.length} matches`)
                console.log(users)
                res.render('pages/index.ejs', {
                    user: users,
                    title: 'Find a match'
                });  
            })    
        }
        // User looking for love with opposing sex
        else if (relationMatch == 'love' && genderMatch == !'nopref'){
            console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that look for love and are attending ${data.events.festival}`)
            userSchema.find({
                '_id': {$ne: data._id},
                'gender': {$ne : data.gender} ,
                'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
                'events.festival':{ $in: festivalMatch }, 
                'prefs.relation':{ $in: ['nopref','love']} 
                }, (err, users) =>{
                console.log(`we found you ${users.length} matches`)
                console.log(users)
                res.render('pages/index.ejs', {
                    user: users,
                    title: 'Find a match'
                });  
            })    
        }
        // User looking for love with Same sex
        else if (relationMatch == 'love'){
            console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that look for love and are attending ${data.events.festival}`)
            userSchema.find({
                '_id': {$ne: data._id},
                'gender': data.gender ,
                'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
                'events.festival':{ $in: festivalMatch }, 
                'prefs.relation':{ $in: ['nopref','love']} 
                }, (err, users) =>{
                console.log(`we found you ${users.length} matches`)
                console.log(users)
                res.render('pages/index.ejs', {
                    user: users,
                    title: 'Find a match'
                });  
            })    
        }
        // User looking for friend with opposing sex
        else if (relationMatch == 'friend' && genderMatch == !'nopref'){
            console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that want to become friends and are attending ${data.events.festival}`)
            userSchema.find({
                '_id': {$ne: data._id},
                'gender': {$ne : data.gender} ,
                'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
                'events.festival':{ $in: festivalMatch }, 
                'prefs.relation':{ $in: ['nopref','friend']} 
                }, (err, users) =>{
                console.log(`we found you ${users.length} matches`)
                console.log(users)
                res.render('pages/index.ejs', {
                    user: users,
                    title: 'Find a match'
                });  
            })    
        }
        // User looking for friend with Same sex
        else if (relationMatch == 'friend'){
            console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that look for love and are attending ${data.events.festival}`)
            userSchema.find({
                '_id': {$ne: data._id},
                'gender': data.gender ,
                'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
                'events.festival':{ $in: festivalMatch }, 
                'prefs.relation':{ $in: ['nopref','friend']} 
                }, (err, users) =>{
                console.log(`we found you ${users.length} matches`)
                console.log(users)
                res.render('pages/index.ejs', {
                    user: users,
                    title: 'Find a match'
                });  
            })    
        }
        // userSchema.find({'events.festival':{ $in: festivalMatch } }, (err, users) => {
        //     console.log(`we found you ${users.length} matches`)
        //     if (err) {
        //         res.send('something went terribly wrong')
        //     }
        //     res.render('pages/index.ejs', {
        //         user: users,
        //         title: 'Find a match'
        //     });
        // });        
    });
    // Route to homepage
    exRoutes.get("/", (req, res) => {
        res.render('pages/splash.ejs', {
            title: "partEmatch",
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
            })
        });
    });
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
    //Route to preferences
    exRoutes.get('/prefs', isLoggedIn, (req, res) => {
        res.render('pages/prefs.ejs', {
            title: 'Prefs'
        });
    });
    exRoutes.post('/prefs', isLoggedIn, urlencodedParser, thisUser, (req, res) => {
        const data = JSON.parse(thisUser);
        userSchema.findById({_id:data._id}, (err, user) => {   
            user.prefs.pref = req.body.pref,
            user.prefs.relation = req.body.relation
            console.log(user)
            user.save();
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

    exRoutes.post('/upload', (req, res) => {
        const user_id = req.session.passport.user;
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
                    userSchema.findOne({ _id: user_id }, async (err, doc) => {
                        if(err) throw err
                        console.log(doc)
                            doc.img = req.file.filename;
                        
                        await doc.save();

                        console.log(req.file.filename);
                    res.redirect('/profile', 200,{
                        msg: 'File uploaded',
                        file: `uploads/${req.file.filename}`
                    })
                    });
                }
            }
        })
    })
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