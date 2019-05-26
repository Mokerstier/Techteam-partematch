
function routes () {

    const exRoutes = require('express').Router();
    
    // Route to homepage
    exRoutes.get("/", function(req, res) {
        res.render('pages/splash.ejs' ,{
            title: "partEmatch",
        });
    });
    // Route to user profile
    // exRoutes.get('/:id', function(req, res) {
    //     User.findOne({
    //         username: User.req.body.firstName
    //     }, function (err, foundUser) {
    //         if (err) {
    //           req.flash("error", "Something went wrong.");
    //           return res.redirect("/");
    //         }
    //         if (foundUser.length == 0) { //Means no data found
    //             res.status(404).render('pages/404.ejs', {
    //             title: "Sorry, user not found"
    //             });
    //         };
    //         res.render('pagges/profile.ejs', {
    //             user: foundUser
    //           });
    //     });
    // });
    // Route to login
    exRoutes.get('/login', function (req, res) {
        res.render('pages/login.ejs',{
            title: 'Login'
        })
    })
    // Route to register page
    exRoutes.get('/register', function(req, res) {
        res.render('pages/register.ejs' ,{
            title: 'Register'
        });
    });
    exRoutes.get('/settings', function (req, res) {
        res.render('pages/settings.ejs', {
            title: 'Settings'
        });
    });
    //Route to register-succes page
    // const bodyParser = require('body-parser');
    // const urlencodedParser = bodyParser.urlencoded({ extended: false });
    
    // exRoutes.post("/register", urlencodedParser, (req, res) => {
        
    //     // const newUser = new User(req.body);
    //     console.log(req.body);
    //     // var newUser = new User(req.body);
    //     // newUser.save()
    //     //     .then(item =>{
    //     //         res.send('User succesfully registered in database');
    //     //     })
    //     //     .catch(err => {
    //     //         res.status(404).send('Unable to register nes user.');
    //     //     });
    //     // res.render('pages/register.ejs' ,{
    //     //     title: 'Register complete!'
    //     // });
    // });
    // adding festivals
    exRoutes.get("/addevent" , function(req, res){
        res.render('pages/addevent.ejs' ,{
            title: "Addevent"
        });
    });
    // exRoutes.get("/addevent-succes", urlencodedParser, function(req, res) {
        
    //     response = {
    //         festival: req.query.festival
    //     }
        
    //     res.end(JSON.stringify(response));
    //     console.log(response);
    // });
    exRoutes.use(function(req, res, next){
        res.status(404).render('pages/404.ejs', {
            title: "Sorry, page not found"
        });
    });

    return exRoutes;

};

exports.routes = routes();