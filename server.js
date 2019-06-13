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

const options = {
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, 
  family: 4 // Use IPv4, skip trying IPv6
};

// Settings for online DATABASE
var uri = process.env.MONGODB_URI;
// mongoose.set("useNewUrlParser", true);
mongoose.connect(uri, options);


// LOCAL DATABASE
// var url = 'mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;
// mongoose.connect(url, { useNewUrlParser: true })
//     .then(() => console.log(`Now connected to MongoDB on database: ${process.env.DB_NAME}!`))
//     .catch(err => console.error('Something went wrong', err));

mongoose.connection.on('open', function(err, doc){
  console.log(`connection established with ${process.env.DB_NAME}`);
})

// Port for running server
const port = process.env.PORT;
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
