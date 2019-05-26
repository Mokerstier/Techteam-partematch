const express = require('express');
const user = require('./routes/users')
const {routes} = require('./routes/routes');
const mongoose = require('mongoose');

const camelCase = require('camelcase');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongo = require('mongodb');
const userSchema = require('./models/user').Schema;

require('dotenv').config();


var db = null;
var url = 'mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;

// mongo.MongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {
//   if (err) {
//     throw err
//   } 
//   db = client.db(process.env.DB_NAME);
// });
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log(`Now connected to MongoDB on database: ${process.env.DB_NAME}!`))
    .catch(err => console.error('Something went wrong', err));
// mongoose.connect(url,{ useNewUrlParser: true }, function (err, client) {
//   if (err) {
//     throw err
//   } 
//   db = client.db(process.env.DB_NAME);
// });

mongoose.connection.on('open', function(err, doc){
  console.log(`connection established with ${process.env.DB_NAME}`);
  var person = mongoose.model('User', userSchema);
  console.log(person.find( {firstName: 'wouter'}))
  // var wouter = {firstName : wouter};
  // person.findOneAndUpdate(wouter, {$set:{'events.festival':'lowlands'}})
  // console.log(person.findOne( {'events.festival':'lowlands'}))

  
});


//   mongoose.connection.db.collection('users', function(err, docs){

//     if (err) return console.log(err);
//     docs.find().forEach(function (err, doc){
//       if (err) return console.log(err);
//       console.log(users.firstName);
//     })
//   })
// });
const port = 3000;
const app = express();



app
    // define static files
    .use(express.static(__dirname, +'/public')) 
    .use(express.json())
    .use('/register', user)
    // define route folder   
    .use('/', routes)
    // define template engine
    .set("view engine", "ejs")
;



app.listen(port, () => console.log(`server is gestart op port ${port}`));