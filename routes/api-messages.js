const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

/**
 * Models
 */
const { Message } = require(__dirname + '/../models/index.js')

/* GET */
router.get('/', async function(req, res, next) {
	Message.findAll().then(data => {
		res.send(data);
	})
});

module.exports = router;
