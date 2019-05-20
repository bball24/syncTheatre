// Created by Dan
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(
    new GoogleStrategy({
        // options
        callbackURL: '/auth/google/redirect',
        clientID: '354987117939-j7513paof7ac7qv22gqvbt1bcinoebgu.apps.googleusercontent.com',
        clientSecret: '5RDEDU5uaaBuwzUrBRz4IZrg'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        console.log('Access Token:' + accessToken);
        profile.token = accessToken;
        done(null, profile);
    })
);

