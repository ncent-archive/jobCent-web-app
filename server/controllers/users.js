const _ = require("lodash");
const User = require("../models").User;
const ChallengeUser = require("../models").ChallengeUser;
const otplib = require("otplib");
const bcrypt = require("bcrypt");
const keys = require("./secret.js");
const awsEmail = require("./awsEmail.js");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK("http://localhost:8010/api");

module.exports = {
    otplib: otplib,
    create(req, res) {
        const otpKey = otplib.authenticator.generateSecret();
        const token = otplib.authenticator.generate(otpKey);
        // in the future write a parser to validate email address format - front end is validating
        const validEmail = true;
        const html = "your jobCent confirmation code is: <b>" + token + "</b>";
        const otpExp = Date.now() + 300000;
        const salt = bcrypt.genSaltSync();
        const saltRounds = 12;
        const tokenHash = bcrypt.hashSync(token, salt);
        const email = req.body.user.email.toLowerCase();
        const password = req.body.user.password;
        const otpReq = req.body.user.otpReq;


        //                              Traditional user/pass login
        // User.findOne({where: {email: email}}).then((user) => {
        //     if (user) {
        //         res.status(403).send({ error: "User already exists." });
        //         return;
        //     } else {
        //         bcrypt.hash(password, saltRounds)
        //         .then((hash) => {
        //             const wallet = nCentSDKInstance.createWalletAddress();
        //             const privateKey = wallet.secret();
        //             const publicKey = wallet.publicKey();
        //             return (
        //                 User.create({
        //                     email: email,
        //                     hash: hash,
        //                     privateKey: privateKey,
        //                     publicKey: publicKey
        //                 }).then(user => {
        //                     res.status(200).send(user);
        //                 })
        //             )
        //         }).catch(err => console.log("err in hashing in create in users.js"));
        //     }
        // });

        //                              Code-based signup (magic link)
        User.findOne({where: {email: email}}).then(user => {
            if (user) {
                return res.status(200).send({ error: "User already exists." });
            } else {
                return User.create({
                    email: email
                })
                .then(user => {
                    data = {};

                    const wallet = nCentSDKInstance.createWalletAddress();
                    data.privateKey = wallet.secret();
                    data.publicKey = wallet.publicKey();
                    return {data: data, user: user};
                })
                .then(obj => {
                    return obj.user.update({
                        publicKey: obj.data.publicKey,
                        privateKey: obj.data.privateKey
                    });
                })
                .then(user => {
                    res.status(201).send(user);
                })
                .catch(error => {
                    res.status(400).send(error);
                });
            }
        });
    },

    async getOne(req, res) {
        const user = await User.findOne({
            where: {uuid: req.params.uuid}
        });
        const sponsoredChallenges = await nCentSDKInstance.retrieveSponsoredChallenges(user.publicKey);
        const heldChallenges = await nCentSDKInstance.retrieveHeldChallenges(user.publicKey);
        res.status(200).send(_.merge({}, sponsoredChallenges.data, heldChallenges.data));
    },
};
