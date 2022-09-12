const nodemailer = require("nodemailer");

let instance = null;

class MailerService {
    static getInstance() {
        if(!instance) {
            instance = new this()
        }

        return instance
    }

    get transporter() {
        const options = {
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            secure: process.env.MAILER_SECURE === 'true' ? true : false,
            debug: process.env.MAILER_DEBUG === 'true' ? true : false,
            auth: {
                user: process.env.MAILER_USERNAME,
                pass: process.env.MAILER_PASSWORD
            }
        }
        if(options.debug) {
            console.log(options)
        }
        return nodemailer.createTransport(options) 
    }

    async sendMailByHtml(from, to, subject, html) {
        return await this.transporter.sendMail({
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        })
    }
}

module.exports = MailerService;