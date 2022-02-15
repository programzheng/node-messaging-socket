const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');

/**
 * Models
 */
const { User } = require(__dirname + '/../models/index.js');

/**
 * Services
 */
const UserService = require(__dirname + '/../services/user.js');
const userService = UserService.getInstance();
const UserThirdPartyValidationService = require(__dirname + '/../services/user-third-party-validation.js');
const userThirdPartyValidationService = UserThirdPartyValidationService.getInstance();

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
        message: '驗證失敗'
    });

    const validateStatus = await userThirdPartyValidationService.validateStatus(user)
    if(validateStatus === false) return res.status(400).send({ error: 'validation error', message: '驗證失敗' })

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
    const userProfile = await user.getUserProfile()

    //send user third party validation
    userThirdPartyValidationService.sendValidation(user, userProfile, req.body.validate_url)

    return res.status(200).send({
        token: userService.gerenateJwtToken(user)
    })
});

router.post('/register/email_validate', async (req, res, next) => {
    const code = req.body.code

    //user third party verify jwt
    const decoded = userThirdPartyValidationService.verifyJwtToken(code)
    if(!decoded || !decoded.uuid) return res.status(401).send({
        message: '驗證失敗'
    })
    const userUuid = decoded.uuid
	const user = await userService.getUserByUuid(userUuid)
    if(!user) return res.status(401).send({
        message: '驗證失敗'
    });

    const userProfile = await user.getUserProfile()
    if(!userProfile) return res.status(401).send({
        message: '驗證失敗'
    });

    const userThirdPartyValidation = await userThirdPartyValidationService.findOrCreate({
        userId: user.id,
        type: 'email',
        thirdPartyId: userProfile.email,
        status: true
    })
    if(!userThirdPartyValidation) return res.status(401).send({
        message: '建立驗證失敗'
    });

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

    const validateStatus = await userThirdPartyValidationService.validateStatus(user)
    if(validateStatus === false) return res.status(400).send({ error: 'validation error', message: '驗證失敗' })

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
