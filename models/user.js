const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.model('User', new mongoose.Schema({
    
    email: {
        type: String, 
        lowercase: true, 
        required: [true, "can't be blank"], 
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String, 
        lowercase: true, 
        required: [true, "can't be blank"], 
        index: true,
        required: true
    },
    lastName: {
        type: String, 
        lowercase: true, 
        required: [true, "can't be blank"], 
        index: true,
        required: true
    },
    
    gender: String,
    age: Date,
    location: String,
    bio: String,
    img: {
        url: String,
        alt: String
    },
    events: {
        festival: [String],
        party: [String]
    }
    
}));
userSchema.schema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

 userSchema.apply(uniqueValidator);
//  , {message: 'is already taken.'}


exports.userSchema = userSchema;
