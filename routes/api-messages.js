const express = require('express');
const router = express.Router();

const MessageService = require(__dirname + '/../services/message.js');
const messageService = MessageService.getInstance();

/* GET */
router.get('/', async function(req, res, next) {
	const messages = await messageService.findAll();

	return res.status(200).send(messages);
});

module.exports = router;
