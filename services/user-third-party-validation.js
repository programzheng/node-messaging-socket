const jwt = require('jsonwebtoken');
const pug = require('pug');

let instance = null;

/**
 * Models
 */
 const { sequelize, UserThirdPartyValidation } = require(__dirname + '/../models/index.js')

/**
 * Services
 */
const MailerService = require(__dirname + '/mailer.js');
const mailerService = MailerService.getInstance();

class UserThirdPartyValidationService {
    constructor(){
        this.saltRounds = 10
        this.jwtSecret = process.env.USER_THIRD_PARTY_VALIDATION_JWT_SECRET
        this.validationType = process.env.USER_THIRD_PARTY_VALIDATION_TYPE
    }

    static getInstance() {
        if(!instance) {
            instance = new this()
        }

        return instance
    }

    async findOrCreate(data) {
        const t = await sequelize.transaction()
        try {
            const [userThirdPartyValidation, creadted] = await UserThirdPartyValidation.findOrCreate({ 
                where: data,
                transaction: t
            })

            if(creadted){
                await t.commit()
            }

            return userThirdPartyValidation
        } catch (error) {
            await t.rollback()

            console.log(error)
        }

        return null
    }

    sendValidation(user, userProfile, validate_url) {
        switch (this.validationType) {
            case 'email':
                const validateUrl = `${validate_url}?code=${this.gerenateJwtToken(user)}`
                this.emailRegisterEmail(userProfile.email, {
                    name: userProfile.name,
                    validate_url: validateUrl
                })
                break;
        }
    }

    async emailRegisterEmail(email, data) {
        return await mailerService.sendMailByHtml(process.env.MAILER_FROM, email, 'programzheng\'s node messaging socket 會員註冊驗證信件', pug.renderFile('./emails/user-register.pug', data))
    }

    gerenateJwtToken(user) {
        const token = jwt.sign({ uuid: user.uuid }, this.jwtSecret);

        return token
    }

    verifyJwtToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);

            return decoded
        } catch(err) {
            console.log(err)
        }
    }

    async validateStatus(user) {
        if(!this.validationType) return null
        let result = false
        const userThirdPartyValidations = await user.getUserThirdPartyValidations()
        switch (this.validationType) {
            case 'email':
                result = userThirdPartyValidations.some(userThirdPartyValidation => userThirdPartyValidation.type == 'email' && userThirdPartyValidation.status == true)
                break;
        }

        return result
    }
}

module.exports = UserThirdPartyValidationService;