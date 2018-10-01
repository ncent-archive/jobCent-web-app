const Challenge = require('../models').Challenge;
const User = require('../models').User;
const ncentSDK = require('ncent-sandbox-sdk');
const sdkInstance = new ncentSDK('http://localhost:8010/api');

module.exports = {
    create(req, res) {
        User.findById(req.body.sponsorId)
        .then(function(user) {
            sdkInstance.stampToken(user.walletAddressPublicKey, req.body.challengeTitle, req.body.tokenAmount, '2020')
            .then(function(stampResponse) {
                return Challenge
                    .create({
                        challengeTitle: req.body.challengeTitle,
                        challengeDescription: req.body.challengeDescription,
                        tokenTypeUuid: stampResponse.data.tokenType.uuid,
                        sponsorId: req.body.sponsorId
                    })
                    .then(challenge => res.status(200).send(challenge))
                    .catch(error => res.status(400).send(error));
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