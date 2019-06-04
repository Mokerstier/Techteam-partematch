const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const camelCase = require('camelcase');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const mongo = require('mongodb');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');

//routes
const {routes} = require('./routes/routes');
// controllers
const user = require('./controllers/users');

require('dotenv').config();
require('./controllers/user-login')(passport);

var url = 'mongodb://127.0.0.1:27017/'+process.env.DB_NAME;


mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log(`Now connected to MongoDB on database: ${process.env.DB_NAME}!`))
    .catch(err => console.error('Something went wrong', err));


mongoose.connection.on('open', function(err, doc){
  console.log(`connection established with ${process.env.DB_NAME}`);
  
});

const port = 3000;
const app = express();

app
    
    
    .use(urlencodedParser)
    // define static files
    .use(express.static(__dirname, +'/public')) 
    .use(express.json())
    .use(cookieParser())
    .use(flash())
    // register route
    .use('/register', user)
    // session
    .use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      //cookie: {secure: true}
    }))
    //passport
    .use(passport.initialize())
    .use(passport.session())
    // define route folder   
    .use('/', routes)
    // define template engine
    .set("view engine", "ejs")
    .set('trust proxy', 1) // used because not communicating over HTTPS and want to set cookie
    
;


app.listen(port, () => console.log(`server is gestart op port ${port}`));