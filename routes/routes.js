function routes () {

    const exRoutes = require('express').Router();
    
    // Route to homepage
    exRoutes.get("/", function(req, res) {
        res.render('pages/index.ejs' ,{
            title: "Home",
        });
    });
    
    // Route to register page
    exRoutes.get('/register', function(req, res) {
        res.render('pages/register.ejs' ,{
            title: "Register"
        });
    });

    //Route to register-succes page
    exRoutes.post("/register", function(req, res) {
        console.log(req.body)
        res.render('pages/register-succes.ejs')
    });
    
    return exRoutes;

};

exports.routes = routes();