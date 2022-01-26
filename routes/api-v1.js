const express = require('express');
const router = express.Router();

const apiUsersRouter = require('./api-users');
const apiUserProfilesRouter = require('./api-user-profiles');
const apiMessagesRouter = require('./api-messages');

router.use('/users', apiUsersRouter);
router.use('/user_profiles', apiUserProfilesRouter);
router.use('/messages', apiMessagesRouter);

module.exports = router;
