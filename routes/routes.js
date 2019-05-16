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
    const bodyParser = require('body-parser');
    const urlencodedParser = bodyParser.urlencoded({ extended: false });
    exRoutes.post("/register", urlencodedParser, function(req, res) {
        console.log(req.body);
        res.render('pages/register-succes.ejs' ,{
            title: 'Register complete!'
        })
    });

    exRoutes.use(function(req, res, next){
        res.status(404).render('pages/404.ejs', 
        {title: "Sorry, page not found"});
    });

    return exRoutes;

};

exports.routes = routes();