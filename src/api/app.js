var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require("passport"); // at header

var apiRouter = require('./routes/api.router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// init passport for authentication
app.use(passport.initialize()); // after line no.20 (express.static)
require("./config/passport.setup");

//allow x-origin form :3000
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

// Routers
let authControllers = require('./controllers/auth.controller');
app.use('/auth', authControllers);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// MongoDB Connection
let mongoUtil = require('./mongo.util');
mongoUtil.connect((err, client) => {
    if (err){
        console.log(">[DB] :: Error Connecting to MongoDB Server. Quitting.")
        console.error(err);
        exit(-1)
    }
    else{
        console.log(">[DB] :: Connection to MongoDB Server Successful")
        console.log(">[DB] :: Creating Collection")
        let db = mongoUtil.getConnection();

        //drop collections
        console.log(">[DB] :: Dropping Tables");
        db.collection('rooms').drop();
        db.collection('users').drop();
        db.collection('videos').drop();
        db.collection('counters').drop();

        //create collections
        console.log(">[DB] :: Creating Tables");
        db.createCollection('rooms');
        db.createCollection('users');
        db.createCollection('videos');
        db.createCollection('counters');

        db.collection('rooms').createIndex({roomID : 1}, {unique : true});
        db.collection('users').createIndex({ userName: "text"});

        //init tables
        console.log(">[DB] :: Init Tables");
        db.collection('counters').insertOne({_id:"roomID",sequence_value:0})
    }
});

module.exports = app;
