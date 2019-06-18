function isLoggedIn(req, res, next) {
	// check if user is logged in with passport
	if (req.isAuthenticated()) {
		return next();
	} 
		res.redirect("/login");
	
}
module.exports = isLoggedIn;
