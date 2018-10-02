const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
const htmlTemplate = require("./html.js");
module.exports = {
    sendMail(from, to, token) {
        aws.config.loadFromPath(`${__dirname}/awsConfig.json`);

        let transporter = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: "2010-12-01"
            })
        });
        let mailOptions;
        if (token) {
            // Setup mail configuration
            mailOptions = {
                from: "noreply@ncnt.io", // sender address
                to: to, // list of receivers
                subject: "jobCent Sign In Code (" + token + ")", // Subject line
                // text: '', // plaintext body
                html: htmlTemplate.confirmationCodeHtml(token) // html body
            };
        } else {

            mailOptions = {
                from: "noreply@ncnt.io",
                to: to,
                subject: "jobCent Sign In Code (" + token + ")",
                // text: '',
                html: htmlTemplate.inviteHtml()
            };
        }
        // send mail
        transporter.sendMail(mailOptions, function(error, info) {
            console.log("sending mail...");

            if (error) {
                console.log(error);
            } else {
                console.log("Message %s sent: %s", info.messageId, info.response);
            }
            transporter.close();
        });
    }
};
