var nodemailer = require('nodemailer');
const Config = require('../config');
let conf = new Config();

class Email{

    transporter;
    mailOptions;

    constructor(subject, text) {
        
        this.transporter = nodemailer.createTransport({
            host: conf.MAIL_HOST,
            port: conf.MAIL_PORT,
            secure: conf.MAIL_SECURE, // true for 465, false for other ports
            auth: {
                user: conf.MAIL_USER,
                pass: conf.MAIL_PASS
            }
        });

        this.mailOptions = {
            from: conf.MAIL_FROM,
            to: conf.MAIL_TO,
            subject: subject,
            text: text
        };
    }

    sendMail() {
        this.transporter.sendMail(this.mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

}

module.exports = Email;