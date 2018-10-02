const User = require("../models").User;
const otplib = require("otplib");
const awsEmail = require("./awsEmail.js");
const bcrypt = require("bcrypt");
const keys = require("./secret.js");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK();

module.exports = {
    otplib: otplib,
    create(req, res) {
        const otpKey = otplib.authenticator.generateSecret();
        const token = otplib.authenticator.generate(otpKey);
        // in the future write a parser to validate email address format.
        const validEmail = true;
        const html = "your jobCent confirmation code is: <b>" + token + "</b>";
        const otpExp = Date.now() + 300000;
        const salt = bcrypt.genSaltSync();
        const tokenHash = bcrypt.hashSync(token, salt);
        const emailAddr = req.body.user.email;
        const otpReq = req.body.user.otpReq;

        User.findOne({ where: { email: emailAddr } }).then(user => {
            if (user) {
                return user
                    .update({
                        otpKey: tokenHash,
                        otpExp: otpExp
                    })
                    .then(user => {
                        const validCode = bcrypt.compareSync(token, tokenHash);
                        console.log(token);

                        console.log("initially valid? " + validCode);
                        awsEmail.sendMail(keys.from, emailAddr, token);
                        res.status(200).send(user.email);
                    })
                    .catch(error => res.status(400).send(error));
            } else if (validEmail) {
                let data = {};
                if (otpReq) {
                    return User.create({
                        email: emailAddr,
                        jobCents: "0",
                        otpKey: tokenHash,
                        otpExp: otpExp
                    })
                        .then(user => {
                            data.user = user;
                            console.log(user);

                            const wallet = nCentSDKInstance.createWalletAddress();
                            data.privateKey = wallet.secret();
                            data.publicKey = wallet.publicKey();
                            return data;
                        })
                        .then(data => {
                            console.log("storing keys..");
                            return data.user.update({
                                publicKey: data.publicKey,
                                privateKey: data.privateKey
                            });
                        })
                        .then(user => {
                            const validCode = otplib.authenticator.check(token, otpKey);
                            console.log(token);
                            console.log("initially valid? " + validCode);

                            awsEmail.sendMail(keys.from, emailAddr, html);
                            res.status(201).send(user);
                        })
                        .catch(error => {
                            console.log(error);

                            res.status(400).send(error);
                        });
                } else {
                    return User.create({
                        email: emailAddr,
                        jobCents: "0"
                    })
                        .then(user => {
                            data.user = user;
                            console.log(user);

                            const wallet = nCentSDKInstance.createWalletAddress();
                            data.privateKey = wallet.secret();
                            data.publicKey = wallet.publicKey();
                            return data;
                        })
                        .then(data => {
                            console.log("storing keys..");
                            return data.user.update({
                                publicKey: data.publicKey,
                                privateKey: data.privateKey
                            });
                        })
                        .then(user => {
                            res.status(201).send(user);
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(400).send(error);
                        });
                }
            } else {
                res.status(400).send({ errors: ["Invalid email address"] });
            }
        });
    },

    getOne(req, res) {
        let data = {};
        const tokenType = "d3c5add3-382e-4505-815b-72221c7f0c45";

        const user = req.session.user;
        new Promise(function(resolve, reject) {
            nCentSDKInstance.getTokenBalance(
                user.publicKey,
                tokenType,
                resolve,
                reject
            );
        })
            .then(token => {
                data.token = token;
                return User.update(
                    { jobCents: data.token.data[0].balance },
                    { where: { id: req.params.id } }
                );
            })
            .then(user => {
                data.user = user;
                console.log(data.token.data[0].balance);
                res.status(200).send({ balance: data.token.data[0].balance });
            })
            .catch(error => {
                console.log(error.response.data);
                res.status(400).send(error.response.data);
            });
        // in the future update this to use session tokens for search
    },
    update(req, res) {
        User.update(
            {
                name: req.body.user.name
            },
            { where: { email: req.body.user.from } }
        )
            .then(user => {
                console.log(user);
                res.status(200).send(user);
            })
            .catch(err => {
                console.log(err);
                res.status(400).send(err);
            });
    }
};
