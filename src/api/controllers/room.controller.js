/**
 * Created by brett on 4/27/19.
 */

let express = require('express');
let router = express.Router();
let RoomModel = require('../models/room.model');

router.get('/', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented "})
});

router.get('/:id', (req, res) => {
    //parse room ID from url
    let roomID = req.params.id;
    let room = new RoomModel();
    room.retrieve(roomID).then((room) => {
        res.status(200).json(room);
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({error : "RoomID not found."});
    })
});

router.post('/', (req, res) => {
    let founderID = req.body.founderID || 1;
    let room = new RoomModel();
    room.founderID = founderID
    room.save().then((result) => {
        res.status(201).json(result)
    })
    .catch((err) => {
        console.error(err)
        res.status(400).json(err);
    })
});

router.put('/:id', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented"})
});

router.delete('/:id', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented"})
});

router.post('/addVideo', (req, res) => {

});


module.exports = router;