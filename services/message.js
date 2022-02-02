/**
 * Models
 */
const { sequelize, Message, User, UserProfile } = require(__dirname + '/../models/index.js')

class MessageService {
    async create(data) {
        const message = await Message.create({
            userId: data.userId,
            socketId: data.socketId,
            message: data.message
        });

        return message;
    }

    async findAll(where) {
        const messages = await Message.scope('userProfile').findAll({
            where: where,
        });

        return messages;
    }
}

module.exports = MessageService;