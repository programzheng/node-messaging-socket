const express = require('express');
const router = express.Router();

const apiMessagesRouter = require('./api-messages');

router.use('/messages', apiMessagesRouter);

module.exports = router;
