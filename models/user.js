const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema =  new mongoose.Schema({
    
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
    dob: Date,
    location: String,
    bio: String,
    img: {
        url: String,
        alt: String
    },
    events: {
        festival: [String],
        party: [String]
    },
    prefs: {
        pref: String,
        relation: String
    }
    
});
userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

 userSchema.plugin(uniqueValidator);
//  , {message: 'is already taken.'}


exports.userSchema = mongoose.model('user', userSchema);
