// Created by Dan
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const passportSetup = require('./config/passport-setup');

passport.use(
    new GoogleStrategy({
        // options
        callbackURL: 'auth/google/redirect',
        clientID: '354987117939-j7513paof7ac7qv22gqvbt1bcinoebgu.apps.googleusercontent.com',
        clientSecret: '5RDEDU5uaaBuwzUrBRz4IZrg'
    }), ( ) => {
        // passport callback function
    })
)