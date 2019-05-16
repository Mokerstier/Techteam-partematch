const express = require('express');
const camelCase = require('camelcase');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const port = 3000;
const app = express();

app
    .use(express.static(__dirname, +'/public'))    
    
    // define template engine
    .set("view engine", "ejs")
    
    // pages
    .get("/", home)
    .get("/register", fetchRegister)
    .post("/register", urlencodedParser, register)

    .use(function (req, res, next ){
        res.status(404).send("Sorry the page you're looking for does not exist?!")
    });
;
function home(req, res) {
    res.render('pages/index.ejs' ,{
        title: "Home",
    });
  }
function fetchRegister(req, res) {
    res.render('pages/register.ejs' ,{
        title: "Register"
    });
}
function register(req, res){
    console.log(req.body)
    res.render('pages/register-succes.ejs')
}

app.listen(port, () => console.log(`server is gestart op port ${port}`));