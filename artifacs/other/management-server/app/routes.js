module.exports = function(app, passport) {

    // HOME PAGE (LOGIN) ========
    app.get('/', function(req, res) {
        res.render('index.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/manage',             
        failureRedirect: '/', 
        failureFlash: true      // allow flash messages
    }));

    // SIGNUP ==============================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('index.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', 
        failureRedirect: '/', 
        failureFlash: true      // allow flash messages
    }));

    // PROFILE SECTION =========================
    app.get('/manage', isLoggedIn, function(req, res) {
        res.render('manage.ejs', {
            user: req.user      // get the user out of session
        });
    });

    // LOGOUT ==============================   
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    
    // if they aren't redirect them to the home page
    res.redirect('/');
}
