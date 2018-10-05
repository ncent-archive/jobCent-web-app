const Challenge = require('../models').Challenge;
const User = require('../models').User;
const ncentSDK = require('ncent-sandbox-sdk');
const sdkInstance = new ncentSDK('http://localhost:8010/api');
const stellarSDK = require("stellar-sdk");

module.exports = {
    create(req, res) {
        User.findAll({
            where: {
                email: req.body.sponsorEmail
            }
        })
        .then(function(users) {
            let tokenTypeUuid;
            sdkInstance.stampToken(users[0].publicKey, req.body.challengeTitle, req.body.tokenAmount || 1000, '2020')
            .then(function(stampResponse) {
                tokenTypeUuid = stampResponse.data.tokenType.uuid;
                let keyPair = stellarSDK.Keypair.fromSecret(users[0].privateKey);
                sdkInstance.createChallenge(keyPair, tokenTypeUuid, req.body.tokenAmount)
                .then(function(createChallengeResponse) {
                    return Challenge.create({
                        challengeTitle: req.body.challengeTitle,
                        challengeDescription: req.body.challengeDescription,
                        tokenTypeUuid: tokenTypeUuid,
                        transactionUuid: createChallengeResponse.data.uuid,
                        rewardAmount: req.body.tokenAmount,
                        sponsorId: users[0].uuid
                    })
                    .then(challenge => res.status(200).send(challenge))
                    .catch(error => res.status(400).send(error));
                });
            })
            .catch(function(err) {
                console.log(err.message);
            })
        })
    },
    list(req, res) {
        return Challenge
            .findAll({
                include: [{
                    model: User,
                    as: 'sponsor'
                }]
            })
            .then(challenge => res.status(200).send(challenge))
            .catch(error => res.status(400).send(error));
    },
    retrieve(req, res) {
        return Challenge
            .findById(req.params.uuid, {
                include: [{
                    model: User
                }]
            })
            .then(challenge => {
                if (!challenge) {
                    return res.status(404).send({
                        message: 'Challenge Not Found',
                    });
                }
                return res.status(200).send(challenge);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        return Challenge
            .findById(req.params.uuid, {
                attributes: ['uuid']
            })
            .then(challenge => {
                if (!challenge) {
                    return res.sendFile(__dirname + '/public/errorpage.html');
                }
                return challenge
                    .update({
                        challengeTitle: req.body.challengeTitle || challenge.challengeTitle,
                        challengeDescription: req.body.challengeDescription || challenge.challengeDescription
                    })
                    .then(challenge => {
                        res.sendFile(__dirname + '/public/index.html');
                    })
                    .catch((error) => res.sendFile(__dirname + '/public/errorpage.html'));
            })
            .catch((error) => res.sendFile(__dirname + '/public/errorpage.html'));
    }
};