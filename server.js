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
    .use(urlencodedParser)
    .use(express.static(__dirname, +'/public')) 
    .use(express.json())
    .use(cookieParser())
    .use(flash())
    .use('/register', user)
    
    .use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      //cookie: {secure: true}
    }))
    .use(passport.initialize())
    .use(passport.session())
    // define route folder   
    .use('/', routes)
    // define template engine
    .set("view engine", "ejs")
    .set('trust proxy', 1) // used because not communicating over HTTPS and want to set cookie
    
;


app.listen(port, () => console.log(`server is gestart op port ${port}`));