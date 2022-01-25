const express = require('express');
const router = express.Router();

const apiUsersRouter = require('./api-users');
const apiMessagesRouter = require('./api-messages');

router.use('/users', apiUsersRouter);
router.use('/messages', apiMessagesRouter);

module.exports = router;
