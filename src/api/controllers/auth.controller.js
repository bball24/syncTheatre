// Created by Dan
let express = require('express');
let router = express.Router();
let UserModel = require('../models/user.model');
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    if(!req.user)
    {
        res.redirect('http://localhost:3000/token/?s=false')
    }

    const user = new UserModel(false);
    user.registerUser(req.user.displayName, req.user.id, req.user.provider);
    user.createRegisteredUser().then((doc) => {
        res.redirect('http://localhost:3000/token/?tok=' + req.user.token + '$s=true&uid=' + user.oauthID )
    })
    .catch((err) => {
            res.redirect('http://localhost:3000/token/?s=false')
    })
});

module.exports = router;