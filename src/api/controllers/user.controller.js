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
    res.status(501).json({ status : "Not Yet Implemented "})
});

router.post('/', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented "})
});

router.post('/temp', (req, res) => {
    new UserModel(true).save()
    .then((userDoc) => {
        res.status(201).json(userDoc);
    })
    .catch((err) => {
        reject({ error: err, message : "Could not create temp user"});
    })
})

router.put('/:id', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented"})
});

router.delete('/:id', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented"})
});

module.exports = router;