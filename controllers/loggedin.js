
function isLoggedIn(req, res, next) {
    // check if user is logged in with passport
    if (req.isAuthenticated()) {
        return next();
    } else
        res.redirect('/login');
}
module.exports = isLoggedIn ;