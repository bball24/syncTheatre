/**
 * Created by brett on 4/27/19.
 */

let express = require('express');
let router = express.Router();
let UserModel = require('../models/user.model');

router.get('/', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented "})
});

router.get('/:id', (req, res) => {
    let userID = req.params.id;
    new UserModel(false).retrieve(Number(userID))
    .then((user) => {
        res.status(200).json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json(err);
    })
});

router.post('/', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented "})
});

router.post('/temp', (req, res) => {
    new UserModel(true).createGuestUser()
    .then((userDoc) => {
        res.status(201).json(userDoc);
    })
    .catch((err) => {
        reject({ error: err, message : "Could not create temp user"});
    })
})

router.post('/register', (req, res) => {
    const userData = req.body;
    const user = new UserModel(false);
    user.registerUser(userData.userName, userData.oauthID, userData.oauthURL);
    user.createRegisteredUser().then((doc) => {
        res.status(201).json(doc);
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json(err);
    })
})

router.get('/roomInfo/:userName', (req, res) => {
    const userName = req.params.userName;
    const user = new UserModel(false);
    user.retrieveByName(userName).then((user) => {
        if(user){
            res.status(200).json({roomName: user.roomName, roomID: user.roomID, userID: user.userID});
        }
        else{
            res.status(400).json({ error : "The userName " + userName + " was not found."});
        }
    })
    .catch((err) => {
        res.status(400).json(err);
    })
});

router.put('/:id', (req, res) => {
    const userID = req.params.id;
    const doc = req.body;
    let user = new UserModel(false);
    user.retrieve(userID)
    .then((currentDoc) => {
        return user.update(doc)
    })
    .then((updatedModel) => {
        res.status(200).json(updatedModel.toJson());
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json(err);
    })
});

router.delete('/:id', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented"})
});

module.exports = router;