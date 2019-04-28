/**
 * Created by brett on 4/27/19.
 */

let express = require('express');
let router = express.Router();
let VideoModel = require('../models/video.model');

router.get('/', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented "})
});

router.get('/:id', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented "})
});

router.post('/', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented "})
});

router.put('/:id', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented"})
});

router.delete('/:id', (req, res) => {
    res.status(501).json({ status : "Not Yet Implemented"})
});

module.exports = router;