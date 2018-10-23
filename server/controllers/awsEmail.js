const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
const htmlTemplate = require("./html.js");
module.exports = {
    sendMail(from, to, options) {
        aws.config.loadFromPath(`${__dirname}/awsConfig.json`);

        let transporter = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: "2010-12-01"
            })
        });
        let mailOptions;
        if (options.token) {
            // Setup mail configuration
            mailOptions = {
                from: "noreply@ncnt.io", // sender address
                to: to, // list of receivers
                subject: "jobCent Sign In Code (" + options.token + ")", // Subject line
                // text: '', // plaintext body
                html: htmlTemplate.confirmationCodeHtml(options.token) // html body
            };
        } else if (options.challengeTitle){

            mailOptions = {
                from: "noreply@ncnt.io",
                to: to,
                subject: "You have received a jobCent Challenge!",
                // text: '',
                html: htmlTemplate.inviteHtml(options.challengeTitle)
            };
        } else if (options.reward) {
            mailOptions = {
                from: "noreply@ncnt.io",
                to: to,
                subject: "Your jobCent Reward!",
                // text: '',
                html: htmlTemplate.rewardHtml(options.reward, options.rewardTitle)
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
