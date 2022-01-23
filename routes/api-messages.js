const express = require('express');
const router = express.Router();

/**
 * Models
 */
const { Message } = require(__dirname + '/../models/index.js')

/* GET */
router.get('/', function(req, res, next) {
	Message.findAll().then(data => {
		res.send(data);
	})
});

module.exports = router;
