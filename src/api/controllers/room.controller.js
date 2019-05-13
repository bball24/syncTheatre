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
// localhost:3001/api/rooms/
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
// localhost:3001/api/rooms/10
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
// localhost:3001/api/rooms/
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
    let videos = []
    videoURL.forEach((url) => {
        videos.push(new VideoModel(url, userID));
    })

	//refactor using factory
	RoomModelFactory.getRoom(roomID).then((room) => {
        videos.forEach((video) => {
            let videoID = video.getVideoID();
            room.enqueueVideo(videoID);
        })
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

// get video queue for room specified by roomID
router.get('/queue/:id', (req, res) => {
    const roomID = req.params.id;
    RoomModelFactory.getRoom(roomID).then((room) => {
        return room.getVideoQueue();
    })
    .then((queue) => {
        res.status(200).json({queue : queue});
    })
    .catch((err) => {
        res.status(400).json(err);
    })
})

//get list of active users in room for specific roomID
router.get('/users/:id', (req, res) => {
    const roomID = req.params.id;
    RoomModelFactory.getRoom(roomID).then((room) => {
        return room.getUserList();
    })
    .then((userList) => {

    })
})

module.exports = router;