const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

/**
 * Models
 */
const { Message } = require(__dirname + '/../models/index.js')

/**
 * Services
 */
const UserService = require(__dirname + '/../services/user.js')
const userService = new UserService

/* GET */
router.get('/', async function(req, res, next) {
	Message.findAll().then(data => {
		res.send(data);
	})
});

module.exports = router;
