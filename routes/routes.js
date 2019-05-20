function routes () {

    const exRoutes = require('express').Router();
    
    // Route to homepage
    exRoutes.get("/", function(req, res) {
        res.render('pages/splash.ejs' ,{
            title: "partEmatch",
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
    
    exRoutes.get("/register", urlencodedParser, function(req, res) {
        console.log(req.body);
        res.render('pages/register-succes.ejs' ,{
            title: 'Register complete!'
        });
    });
    // adding festivals
    exRoutes.get("/addevent" , function(req, res){
        res.render('pages/addevent.ejs' ,{
            title: "Addevent"
        });
    });
    exRoutes.get("/addevent-succes", urlencodedParser, function(req, res) {
        
        response = {
            festival: req.query.festival
        }
        
        res.end(JSON.stringify(response));
        console.log(response);
    });
    exRoutes.use(function(req, res, next){
        res.status(404).render('pages/404.ejs', {
            title: "Sorry, page not found"
        });
    });

    return exRoutes;

};

exports.routes = routes();