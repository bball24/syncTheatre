var express = require('express');
var router = express.Router();
var host = "http://localhost:3000";

// Root Index API End-Point
router.get('/', function(req, res, next) {
	res.status(200).json({
		name: 'SyncTheatre API',
		build: "Development v1.0",
		description: 'API Endpoints for SyncTheatre Web-App',
        info : "For CS180 Software Engineering Group Project",
		authors : ["Brett Korp", "Daniel D'Orange", "Jerry Tan", "Jerry Tan"],
		routes : {
			index : 'GET /api/',
			rooms : [
				'GET /api/rooms/',
                'GET /api/rooms/:id',
                'POST /api/rooms/',
                'PUT /api/rooms/:id',
                'DELETE /api/rooms/:id'
			],
			videos : [
                'GET /api/videos/',
                'GET /api/videos/:id',
                'POST /api/videos/',
                'PUT /api/videos/:id',
                'DELETE /api/videos/:id'
			],
			users : [
                'GET /api/users/',
                'GET /api/users/:id',
                'POST /api/users/',
                'PUT /api/users/:id',
                'DELETE /api/users/:id'
			]
		}
	});
});

// Room Routes
let roomControllers = require('../controllers/room.controller');
router.use('/rooms', roomControllers);

// User Routes
let userControllers = require('../controllers/user.controller');
router.use('/users', userControllers);

// Video Routes
let videoControllers = require('../controllers/video.controller');
router.use('/videos', videoControllers);


module.exports = router;
