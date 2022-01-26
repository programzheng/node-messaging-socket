const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

/**
 * Models
 */
const { UserProfile } = require(__dirname + '/../models/index.js')

/**
 * Services
 */
const UserService = require(__dirname + '/../services/user.js')
const userService = new UserService

router.get('/', jwt({ secret: userService.jwtSecret, algorithms: ['HS256'] }), async function(req, res, next) {
    const user = await userService.getUserByUuid(req.user.uuid)
	UserProfile.findOne({
        where: {
            userId: user.id
        }
    }).then(data => {
		res.status(200).send(data);
	})
});

router.put('/', jwt({ secret: userService.jwtSecret, algorithms: ['HS256'] }), async function(req, res, next) {
    const user = await userService.getUserByUuid(req.user.uuid)

    const data = {
        userId: user.id,
        email: req.body.email,
        name: req.body.name
    }

    const userProfile = await userService.updateUserProfile(data)
    if(!userProfile) return res.status(400).send({ error: 'update error' })

    res.status(200).send(userProfile)
});


module.exports = router;
