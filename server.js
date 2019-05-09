const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => console.log(`server is gestart op port ${port}`));

const camelCase = require('camelcase');

app
    
    .set("view engine", "ejs")

    .get("/", home)
    .get("/register", fetchRegister)
    
    .use('/public', express.static('public'))
    .use(function (req, res, next ){
        res.status(404).send("Sorry the page you're looking for does not exist?!")
    });
;
function home(req, res) {
    res.render('pages/index.ejs' ,{
        title: "Home"
    });
  }
function fetchRegister(req, res) {
    res.render('pages/register.ejs')
}