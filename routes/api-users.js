const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

/**
 * Models
 */
const { User } = require(__dirname + '/../models/index.js')

/**
 * Services
 */
const UserService = require(__dirname + '/../services/user.js')
const userService = new UserService

router.get('/', function(req, res, next) {
	Message.findAll().then(data => {
		res.status(200).send(data);
	})
});

router.post('/', async function(req, res, next) {
	const account = req.body.account
    const password = req.body.password

    const user = await User.create({
        uuid: userService.generateUuid(),
        account: account,
        password: await userService.gerenateHashPassword(password)
    })
    if(!user) return res.status(400).send({ error: 'create error' })

    res.status(200).send(user)
});

router.post('/auth', jwt({ secret: userService.jwtSecret, algorithms: ['HS256'] }), async function(req, res, next) {
	const user = await userService.getUserByUuid(req.user.uuid)
    res.status(200).send(user)
});

router.post('/login', async (req, res, next) => {
    const account = req.body.account
    const user = await User.findOne({
        where: {
            account: account
        }
    })
    if(!user) return res.status(400).send({ error: 'account error' })
    //check hash password
    const password = req.body.password
    if(!await userService.compareHashPassword(password, user.password)) return res.status(400).send({ error: 'password error'})

    //gerenate jwt token
    const jwtToken = userService.gerenateJwtToken(user)

    return res.status(200).send({
        token: jwtToken
    })
});


module.exports = router;
