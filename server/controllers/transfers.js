const stellarSDK = require("stellar-sdk");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK();
const Transfer = require("../models").Transfer;
const User = require("../models").User;
const awsEmail = require("./awsEmail.js");
module.exports = {
    create(req, res) {
        const from = req.body.from;
        const to = req.body.to;
        const amount = parseInt(req.body.amount);

        const tokenType = "d3c5add3-382e-4505-815b-72221c7f0c45";
        let fromUser;
        let toUser;
        let fromBalance;
        let data = {};
        User.findOne({ where: { email: from } })
            .then(user => {
                fromUser = user;
                fromBalance = parseInt(user.jobCents);
                console.log(fromBalance);
                console.log(fromBalance > amount);

                return User.findOne({ where: { email: to } });
            })
            .then(user => {
                toUser = user;
                if (!toUser) {
                    User.create({
                        email: to
                    })
                        .then(user => {
                            data.user = user;
                            const wallet = nCentSDKInstance.createWalletAddress();
                            data.privateKey = wallet.secret();
                            data.publicKey = wallet.publicKey();
                            return data;
                        })
                        .then(data => {
                            return data.user.update({
                                publicKey: data.publicKey,
                                privateKey: data.privateKey
                            });
                        })
                        .then(user => {
                            toUser = user;
                            console.log(fromUser);
                            console.log("toUser#########");

                            console.log(toUser);

                            if (fromBalance >= amount) {
                                keyPair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
                                new Promise(function(resolve, reject) {
                                    nCentSDKInstance.transferTokens(
                                        keyPair,
                                        toUser.publicKey,
                                        tokenType,
                                        amount,
                                        resolve,
                                        reject
                                    );
                                })
                                    .then(transfer => {
                                        console.log(transfer.data);

                                        data = transfer.data;
                                        Transfer.create({
                                            from,
                                            to,
                                            amount
                                        }).then(transfer => {
                                            console.log("data sender balance");

                                            console.log(data.sender.balance);

                                            fromUser
                                                .update({
                                                    jobCents: data.sender.balance
                                                })
                                                .then(fromuser => {
                                                    data.fromUser = fromuser;
                                                    console.log("data receiver balance");
                                                    console.log(data.receiver.balance);
                                                    toUser
                                                        .update({
                                                            jobCents: data.receiver.balance
                                                        })
                                                        .then(touser => {
                                                            data.toUser = touser;

                                                            awsEmail.sendMail(
                                                                data.fromUser.email,
                                                                data.toUser.email
                                                            );
                                                            data.toUser = touser;
                                                            res.status(200).send(data);
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });
                                                });
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(400).send("error");
                                    });
                            } else {
                                return res.status(400).send("not enough jobCents");
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(400).send(error);
                        });
                } else if (fromBalance >= amount) {
                    keyPair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
                    new Promise(function(resolve, reject) {
                        nCentSDKInstance.transferTokens(
                            keyPair,
                            toUser.publicKey,
                            tokenType,
                            amount,
                            resolve,
                            reject
                        );
                    })
                        .then(transfer => {
                            console.log(transfer.data);
                            data = transfer.data;
                            Transfer.create({
                                from,
                                to,
                                amount
                            }).then(transfer => {
                                console.log("data sender balance");
                                console.log(data.sender.balance);
                                fromUser
                                    .update({
                                        jobCents: data.sender.balance
                                    })
                                    .then(fromuser => {
                                        data.fromUser = fromuser;
                                        console.log("data receiver balance");
                                        console.log(data.receiver.balance);
                                        toUser
                                            .update({
                                                jobCents: data.receiver.balance
                                            })
                                            .then(touser => {
                                                data.toUser = touser;

                                                awsEmail.sendMail(
                                                    data.fromUser.email,
                                                    data.toUser.email
                                                );
                                                data.toUser = touser;
                                                res.status(200).send(data);
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            });
                                    });
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).send("error");
                        });
                } else {
                    return res.status(400).send("not enough jobCents");
                }
            })
            .catch(err => {
                res.status(400).send(err);
            });
    },
    findAll(req, res) {
        console.log(req.session);
        const email = req.session.user.email;
        let data = {};
        Transfer.findAll({
            where: {
                from: email
            }
        })
            .then(sent => {
                console.log("sent tokens");

                console.log(sent);
                data.sent = sent;
                return Transfer.findAll({
                    where: {
                        to: email
                    }
                });
            })
            .then(received => {
                console.log("received tokens");

                console.log(received);
                data.received = received;
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(err);
                res.status(400).send(err);
            });
    }
};
