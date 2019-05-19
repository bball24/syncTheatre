// Created by Dan
let express = require('express');
let router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send("this is the callback URL");
});

module.exports = router;