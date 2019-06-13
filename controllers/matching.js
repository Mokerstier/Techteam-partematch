const match = require('express').Router();

let genderMatch = (req, res, next) => {
    const user_id = req.session.passport.user;
    userSchema.findOne({_id:user_id}, (err, doc) =>{
        if (!doc){
            res.redirect('/profile')
            
        } else 
            genderMatch = doc.prefs.pref;
            console.log(genderMatch) 

            return next(null, genderMatch)
})};
// Matching logic based on festival
let festivalMatch = (req, res, next) => {
    const user_id = req.session.passport.user;
    userSchema.findOne({_id:user_id}, (err, doc) =>{
        if (!doc){
            res.redirect('/profile')
            
        } else 
            festivalMatch = doc.events.festival;                                       
            return next(null, festivalMatch)
})};
let relationMatch = (req, res, next) => {
    const user_id = req.session.passport.user;
    userSchema.findOne({_id:user_id}, (err, doc) =>{
        if (!doc){
            res.redirect('/profile')
            
        } else 
            gender = doc.gender
            relationMatch = doc.prefs.relation;                                       
            return next(null, relationMatch)
})};
//Route to match when logged in and with matchingLogic based on festival
exRoutes.get('/match', isLoggedIn, thisUser, festivalMatch, genderMatch, relationMatch, (req, res) => {
    const data = JSON.parse(thisUser)

    // User looking for all kind of relations <3 in both sexes
    if (genderMatch == 'nopref' && relationMatch == 'nopref'){
        console.log (`I'm a ${data.gender}, looking for ${genderMatch} people who are attending ${data.events.festival}`)
        userSchema.find({
            '_id': {$ne: data._id},
            'prefs.pref':{ $in: [data.gender, 'nopref'] }, 
            'events.festival':{ $in: festivalMatch } 
            }, (err, users) =>{
            console.log(`we found you ${users.length} matches`)
            console.log(users)
            res.render('pages/index.ejs', {
                user: users,
                title: 'Find a match'
            });  
        })
    }
    // User looking for friends of both sexes
    else if (genderMatch == 'nopref' && relationMatch == 'friend'){
        console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that want to become friends and are attending ${data.events.festival}`)
        userSchema.find({
            '_id': {$ne: data._id},
            'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
            'prefs.relation':{ $in: ['nopref','friend'] },
            'events.festival':{ $in: festivalMatch }   
            }, (err, users) =>{
            console.log(`we found you ${users.length} matches`)
            console.log(users)
            res.render('pages/index.ejs', {
                user: users,
                title: 'Find a match'
            });  
        })     
    }
    // User looking for love with all sexes
    else if (genderMatch == 'nopref' && relationMatch == 'love'){
        console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that want to become friends and are attending ${data.events.festival}`)
        userSchema.find({
            '_id': {$ne: data._id},
            'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
            'events.festival':{ $in: festivalMatch }, 
            'prefs.relation':{ $in: ['nopref','love']} 
            }, (err, users) =>{
            console.log(`we found you ${users.length} matches`)
            console.log(users)
            res.render('pages/index.ejs', {
                user: users,
                title: 'Find a match'
            });  
        })    
    }
    // User looking for love with opposing sex
    else if (relationMatch == 'love' && genderMatch == !'nopref'){
        console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that look for love and are attending ${data.events.festival}`)
        userSchema.find({
            '_id': {$ne: data._id},
            'gender': {$ne : data.gender} ,
            'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
            'events.festival':{ $in: festivalMatch }, 
            'prefs.relation':{ $in: ['nopref','love']} 
            }, (err, users) =>{
            console.log(`we found you ${users.length} matches`)
            console.log(users)
            res.render('pages/index.ejs', {
                user: users,
                title: 'Find a match'
            });  
        })    
    }
    // User looking for love with Same sex
    else if (relationMatch == 'love'){
        console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that look for love and are attending ${data.events.festival}`)
        userSchema.find({
            '_id': {$ne: data._id},
            'gender': data.gender ,
            'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
            'events.festival':{ $in: festivalMatch }, 
            'prefs.relation':{ $in: ['nopref','love']} 
            }, (err, users) =>{
            console.log(`we found you ${users.length} matches`)
            console.log(users)
            res.render('pages/index.ejs', {
                user: users,
                title: 'Find a match'
            });  
        })    
    }
    // User looking for friend with opposing sex
    else if (relationMatch == 'friend' && genderMatch == !'nopref'){
        console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that want to become friends and are attending ${data.events.festival}`)
        userSchema.find({
            '_id': {$ne: data._id},
            'gender': {$ne : data.gender} ,
            'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
            'events.festival':{ $in: festivalMatch }, 
            'prefs.relation':{ $in: ['nopref','friend']} 
            }, (err, users) =>{
            console.log(`we found you ${users.length} matches`)
            console.log(users)
            res.render('pages/index.ejs', {
                user: users,
                title: 'Find a match'
            });  
        })    
    }
    // User looking for friend with Same sex
    else if (relationMatch == 'friend'){
        console.log (`I'm a ${data.gender}, looking for ${genderMatch} people, that look for love and are attending ${data.events.festival}`)
        userSchema.find({
            '_id': {$ne: data._id},
            'gender': data.gender ,
            'prefs.pref':{ $in: [data.gender, 'nopref'] } ,
            'events.festival':{ $in: festivalMatch }, 
            'prefs.relation':{ $in: ['nopref','friend']} 
            }, (err, users) =>{
            console.log(`we found you ${users.length} matches`)
            console.log(users)
            res.render('pages/index.ejs', {
                user: users,
                title: 'Find a match'
            });  
        })    
    }       
});