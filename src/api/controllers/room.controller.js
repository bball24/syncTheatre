/**
 * Created by brett on 4/27/19.
 */

let express = require('express');
let router = express.Router();

let RoomModel = require('../models/room.model').RoomModel;
let RoomModelFactory = require('../models/room.model').RoomModelFactory;
let VideoModel = require('../models/video.model');
let mongoUtil = require('../mongo.util');

//get all rooms up to limit
router.get('/', (req, res) => {
    let limit = 10
    RoomModelFactory.getAllRooms(limit)
    .then((rooms) => {
        let docs = [];
        rooms.forEach((room) => {
            docs.push(room.toJson());
        })
        res.status(200).json(docs);
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({error : "No rooms found."});
    })
});

//get one room
router.get('/:id', (req, res) => {
    //parse room ID from url
    let roomID = req.params.id;
    RoomModelFactory.getRoom(roomID).then((room) => {
        res.status(200).json(room.toJson());
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({error : "RoomID not found."});
    })
});

// Create Room
router.post('/', (req, res) => {
    let founderID = req.body.founderID || -1;
    let room = new RoomModel();
    room.founderID = founderID
    room.create().then((result) => {
        res.status(201).json(result)
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json(err);
    })
});

//update room
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let doc = req.body;
    RoomModelFactory.updateRoom(id, doc).then((room) => {
        res.status(201).json(room.toJson());
    })
    .catch((err) => {
        console.error("[ERR] :: " + err);
        res.status(400).json({ error : err});
    })
});

//delete room
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    RoomModelFactory.deleteRoom(id).then((result) => {
        res.status(200).json(result);
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json(err)
    })
});

//add a video to a room
router.post('/addVideo', (req, res) => {
	//step 1: Get post data from req
	let roomID = req.body.roomID;
	let userID = req.body.userID;
	let videoURL = req.body.videoURL;

	//step 2: Instantiate video model
	let video = new VideoModel(videoURL, userID);

	//refactor using factory
	RoomModelFactory.getRoom(roomID).then((room) => {
	    let videoID = video.getVideoID();
	    room.enqueueVideo(videoID);

        return RoomModelFactory.updateRoom(roomID, room.toJson());
    })
    .then((room) => {
        res.status(200).json(room.toJson());
    })
    .catch((err) => {
        console.error(err)
        res.status(400).json(err);
    })
});


module.exports = router;