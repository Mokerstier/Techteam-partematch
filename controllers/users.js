const { userSchema } = require('../models/user')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })

router.post('/', urlencodedParser, async (req, res) => {
	// Check if this user already exisits
	let user = await userSchema.findOne({ email: req.body.email })
	if (user) {
		return res.status(400).send('That user already exisits!')
	} else {
		// Insert the new user if they do not exist yet
		user = new userSchema({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			gender: req.body.gender,
			dob: req.body.dob,
			location: req.body.location,
			bio: req.body.bio,
			img: '',
			events: {
				festival: req.body.festival,
				party: ['']
			},
			prefs: {
				pref: req.body.pref,
				relation: req.body.relation
			}
		})

		await user.save()

		// res.send('Succesfully registerd '+user.firstName+' with '+ user.email+' this e-mail!');
		res.redirect('/profile')
	}
})

module.exports = router
