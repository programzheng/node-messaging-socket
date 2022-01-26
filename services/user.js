const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Models
 */
 const { User } = require(__dirname + '/../models/index.js')

class UserService {
    constructor(){
        this.saltRounds = 10
        this.jwtSecret = process.env.USER_JWT_SECRET
    }

    async create(data) {
        const t = await sequelize.transaction()

        try {
            const user = await User.create({
                uuid: this.generateUuid(),
                account: data.account,
                password: await this.gerenateHashPassword(data.password)
            }, { transaction: t })

            await t.commit()

            return user
        } catch (error) {
            await t.rollback()

            console.log(error)
        }

        return null
    }

    generateUuid() {
        return uuidv4()
    }

    gerenateHashPassword(password) {
        console.log(this.saltRounds)
        return bcrypt.hash(password, this.saltRounds).then((hash) => {
            return hash
        });
    }

    compareHashPassword(password, userPassword) {
        const match = bcrypt.compare(password, userPassword);

        return match
    }

    gerenateJwtToken(user) {
        const token = jwt.sign({ uuid: user.uuid }, this.jwtSecret);

        return token
    }

    getUserByUuid(uuid) {
        return User.findOne({
            where: {
                uuid: uuid
            }
        })
    }
}

module.exports = UserService;