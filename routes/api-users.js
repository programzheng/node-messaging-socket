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

router.post('/', async function(req, res, next) {

    const data = {
        account: req.body.account,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name
    }

    const user = await userService.create(data)
    if(!user) return res.status(400).send({ error: 'create error' })

    return res.status(200).send({
        token: userService.gerenateJwtToken(user)
    })
});

router.post('/auth', userService.jwtAuthRequiredMiddleware(), async function(req, res, next) {
	const user = await userService.getUserByUuid(req.user.uuid)
    if(!user) return res.status(200).send({
        'message': '驗證失敗'
    });

    res.status(200).send(user)
});

router.post('/register', async (req, res, next) => {
    const data = {
        account: req.body.account,
        password: req.body.password,
        email: req.body.account,
        name: req.body.name
    }

    const user = await userService.create(data)
    if(!user) return res.status(400).send({ error: 'create error' })

    return res.status(200).send({
        token: userService.gerenateJwtToken(user)
    })
});

router.post('/login', async (req, res, next) => {
    const account = req.body.account
    const user = await User.findOne({
        where: {
            account: account
        }
    })
    if(!user) return res.status(400).send({ error: 'account error', message: '帳號錯誤' })
    
    //check hash password
    const password = req.body.password
    if(!await userService.compareHashPassword(password, user.password)) return res.status(400).send({ error: 'password error'})

    //gerenate jwt token
    const jwtToken = userService.gerenateJwtToken(user)

    return res.status(200).send({
        token: jwtToken
    })
});

router.delete('/:id', async(req, res) => {
    const userId = req.params.id;
    const user = await userService.deleteUserById(userId);
    if(!user) return res.status(200).send({
        message: '刪除失敗'
    });

    return res.status(200).send({
        message: '刪除成功'
    });
});

module.exports = router;
