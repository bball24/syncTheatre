var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.json({
		name: 'cool express app',
		author: 'syncTheatre'
	});
	//res.send('This is my cool homepage!!! CS180!!');
});

router.get('/square/:num1', function(req, res){
	var a = req.params.num1;
	console.log(a);
	var squared = a * a;
	res.json({ result : squared})
});

module.exports = router;
