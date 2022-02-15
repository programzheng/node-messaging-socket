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
const userService = UserService.getInstance();

router.get('/', userService.jwtAuthRequiredMiddleware(), async function(req, res, next) {
    const user = await userService.getUserByUuid(req.user.uuid)
    if(!user) return res.status(200).send({
        'message': '請先登入'
    });
    
	const userProfile = await user.getUserProfile()

    return res.status(200).send(userProfile);
});

router.put('/', userService.jwtAuthRequiredMiddleware() , async function(req, res, next) {
    const user = await userService.getUserByUuid(req.user.uuid)
    if(!user) return res.status(200).send({
        'message': '請先登入'
    });

    const data = {
        userId: user.id,
        email: req.body.email,
        name: req.body.name
    }

    const userProfile = await userService.updateUserProfile(data)
    if(!userProfile) return res.status(400).send({ error: 'update error' })

    return res.status(200).send(userProfile)
});


module.exports = router;
