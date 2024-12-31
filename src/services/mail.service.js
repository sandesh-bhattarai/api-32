require('dotenv').config();
const nodemailer = require("nodemailer");

class MailService {
    transport;

    constructor() {
        // connect, gmail as smtp (100 emails), sendgrid => verify domain, sender ,mailchimp, mailtrap
        // testing => mailtrap
        // real implement  => 
        try {
            console.log(process.env.SMTP_HOST,process.env.SMTP_USER)
            let config = {
                host: process.env.SMTP_HOST, 
                port: process.env.SMTP_PORT,  
                
                auth: {
                    user: process.env.SMTP_USER,  
                    pass: process.env.SMTP_PWD
                }
            }

            if(process.env.SMTP_SERVICE === 'gmail') {
                config['service'] = 'gmail'
            }
            this.transport = nodemailer.createTransport(config)
        }catch(exception) {
            console.log("Error connecting Mail server....")
            throw exception;
        }
    }

    sendEmail = async (to, sub, message, attachements = null) => {
        try {
            const ack = await this.transport.sendMail({
                to: to,
                from: process.env.SMTP_FROM,
                subject: sub, 
                html: message
            })
            console.log(ack)
            return ack;
        } catch(exception) {
            console.log("Error sending email...", exception)
            throw exception
        }
    }
}

const mailSvc = new MailService()
module.exports = mailSvc;