const nodemailer = require("nodemailer");

class Mailer {
    get transporter() {
        return nodemailer.createTransport({
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            auth: {
                user: process.env.MAILER_USERNAME,
                pass: process.env.MAILER_PASSWORD
            }
        });
    }

    async sendMailByHtml(from, to, subject, html) {
        console.log(this.transporter);
        await this.transporter.sendMail({
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        })
    }
}

module.exports.Mailer = Mailer;