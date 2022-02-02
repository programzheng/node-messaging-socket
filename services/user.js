const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

/**
 * Models
 */
 const { sequelize, User, UserProfile } = require(__dirname + '/../models/index.js')

class UserService {
    constructor(){
        this.saltRounds = 10
        this.jwtSecret = process.env.USER_JWT_SECRET
        this.jwtExpiresIn = '24h'
    }

    async create(data) {
        const t = await sequelize.transaction()

        try {
            const user = await User.create({
                uuid: this.generateUuid(),
                account: data.account,
                password: await this.gerenateHashPassword(data.password)
            }, { transaction: t })

            await UserProfile.create({
                userId: user.id,
                email: data.email,
                name: data.name,
            }, { transaction: t })

            await t.commit()

            return user
        } catch (error) {
            await t.rollback()

            console.log(error)
        }

        return null
    }

    async deleteUserById(id) {
        const user = User.destroy({
            where: {
                id: id
            }
        });

        const userProfile = UserProfile.destroy({
            where: {
                userId: id
            }
        });

        const result = (user&&userProfile) ? true : false;

        return result;
    }

    async updateUserProfile(data) {
        const userProfile = await UserProfile.findOne({
            where: {
                userId: data.userId
            }
        })
        userProfile.update({
            email: data.email,
            name: data.name
        })

        return userProfile
    }

    generateUuid() {
        return uuidv4()
    }

    gerenateHashPassword(password) {
        return bcrypt.hash(password, this.saltRounds).then((hash) => {
            return hash
        });
    }

    compareHashPassword(password, userPassword) {
        const match = bcrypt.compare(password, userPassword);

        return match
    }

    gerenateJwtToken(user) {
        const token = jwt.sign({ uuid: user.uuid }, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        });

        return token
    }

    getUserByUuid(uuid) {
        return User.scope(['withoutAccount','withoutPassword']).findOne({
            where: {
                uuid: uuid
            }
        })
    }

    jwtAuthRequiredMiddleware() {
        return expressJwt({ secret: this.jwtSecret, algorithms: ['HS256'] })
    }
}

module.exports = UserService;