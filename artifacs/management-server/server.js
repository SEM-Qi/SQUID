// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = 8585;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url);         // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

    // set up our express application
    app.use(express.logger('dev'));     // log every request to the console
    app.use(express.cookieParser());    // read cookies (needed for auth)
    app.use(express.bodyParser());      // get information from html forms

    app.use("/css", express.static(__dirname + '/public/css'));
    app.use("/js", express.static(__dirname + '/public/js'));
    app.use("/ipaddress", express.static(__dirname + '/public/ipaddress'));

    app.set('view engine', 'ejs');      // set up ejs for templating

    // required for passport
    app.use(express.session({secret: 'ilovescotchscotchyscotchscotch'}));
    app.use(passport.initialize());
    app.use(passport.session());        // persistent login sessions
    app.use(flash());                   // flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('GROUND CONTROL now running on port ' + port);


