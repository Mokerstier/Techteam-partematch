const express = require('express');
const {routes} = require('./routes/routes');
const camelCase = require('camelcase');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const port = 3000;
const app = express();

app
    // define static files
    .use(express.static(__dirname, +'/public')) 
    // define external route folder   
    .use('/', routes)
    // define template engine
    .set("view engine", "ejs")
    .use(function (req, res, next ){
        res.status(404).render('pages/404.ejs')
    });
;

app.listen(port, () => console.log(`server is gestart op port ${port}`));