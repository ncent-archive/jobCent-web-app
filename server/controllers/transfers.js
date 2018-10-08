const stellarSDK = require("stellar-sdk");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK('http://localhost:8010/api');
const Transfer = require("../models").Transfer;
const User = require("../models").User;
const awsEmail = require("./awsEmail.js");
module.exports = {
    create(req, res) {
        const from = req.body.from;
        const to = req.body.to;
        const tokenType = req.body.tokenTypeUuid;
        const transactionUuid = req.body.transactionUuid;

        console.log(from, to, tokenType, transactionUuid);

        let fromUser;
        let toUser;
        let fromBalance;
        let data = {};

        User.findOne({ where: { email: from } })
        .then(user => {
            fromUser = user;
            nCentSDKInstance.getWalletBalance(
                user.publicKey,
                tokenType
            )
            .then(walletBalance => {
                fromBalance = walletBalance.data.balance;
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
                        let keyPair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
                        nCentSDKInstance.shareChallenge(
                            keyPair,
                            transactionUuid,
                            toUser.publicKey
                        )
                        .then(transfer => {
                            awsEmail.sendMail(
                                from,
                                to
                            );
                            res.status(200).send(transfer.data);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).send("error");
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(400).send(error);
                    });
                } else {
                    let keyPair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
                    nCentSDKInstance.shareChallenge(
                        keyPair,
                        transactionUuid,
                        toUser.publicKey
                    )
                    .then(transfer => {
                        awsEmail.sendMail(
                            from,
                            to
                        );
                        res.status(200).send(transfer.data);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).send("error");
                    });
                }
            })
            .catch(err => {
                res.status(400).send(err);
            });
        })
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
