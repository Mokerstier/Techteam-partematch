const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const camelCase = require('camelcase');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongo = require('mongodb');
const {userSchema} = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//routes
const {routes} = require('./routes/routes');
// controllers
const user = require('./controllers/users');
const login = require('./controllers/user-login');
require('dotenv').config();


var db = null;
var url = 'mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;


mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log(`Now connected to MongoDB on database: ${process.env.DB_NAME}!`))
    .catch(err => console.error('Something went wrong', err));


mongoose.connection.on('open', function(err, doc){
  console.log(`connection established with ${process.env.DB_NAME}`);
  
});

const port = 3000;
const app = express();


app
    // define static files
    .use(express.static(__dirname, +'/public')) 
    .use(express.json())
    .use('/register', user)
    .use(passport.initialize())
    .use(passport.session())
    // define route folder   
    .use('/', routes)
    // define template engine
    .set("view engine", "ejs")
    .set('trust proxy', 1) // used because not communicating over HTTPS and want to set cookie
    .use(session({
      secret: 'partEmatch secret',
      resave: false,
      saveUninitialized: true,
      cookie: {secure: true}
    }))
;
require('./controllers/user-login')(passport);


app.listen(port, () => console.log(`server is gestart op port ${port}`));