const _ = require('lodash');
const User = require("../models").User;
const ncentSDK = require('ncent-sandbox-sdk');
const stellarSDK = require('stellar-sdk');
const sdkInstance = new ncentSDK('http://18.219.110.45:8010/api');
const keys = require("./secret.js");
const awsEmail = require("./awsEmail.js");

const handleProvenance = async (transactionUuid, challenge) => {
    const pChainResp = await sdkInstance.retrieveProvenanceChain(transactionUuid);
    const pChain = pChainResp.data;
    let challengeReward = parseFloat(challenge.rewardAmount)/2.0;
    for (let i = pChain.length - 2; i >= 0; i--) {
        if (pChain[i].parentTransaction) {
            const recipient = await User.findOne({where: {publicKey: pChain[i].toAddress}});
            awsEmail.sendMail(keys.from, recipient.email, {reward: challengeReward, rewardTitle: challenge.name});
        }
        challengeReward = challengeReward/2.0;
    }
};

module.exports = {
    async create(req, res) {
        let tokenTypeUuid;
        const expiration = '2020';
        const { senderPublicKey, name, rewardAmount } = req.body;
        const rewardAmountInt = parseInt(rewardAmount);
        const user = await User.findOne({where: {publicKey: senderPublicKey}});
        const senderKeypair = stellarSDK.Keypair.fromSecret(user.privateKey);
        const stampResponse = await sdkInstance.stampToken(senderPublicKey, name, rewardAmountInt, expiration);
        tokenTypeUuid = stampResponse.data.tokenType.uuid;
        const createChallengeResponse = await sdkInstance.createChallenge(senderKeypair, name, expiration, tokenTypeUuid, rewardAmountInt);
        res.status(200).send({challenge: createChallengeResponse.data});
    },

    async share({body, params}, res) {
        const fromAddress = body.fromAddress;
        const toAddress = body.toAddress;
        const challengeUuid = params.challengeUuid;
        const challenge = await sdkInstance.retrieveChallenge(challengeUuid);

        const fromUser = await User.findOne({where: {email: fromAddress}});
        let toUser = await User.findOne({where: {email: toAddress}});

        if (!toUser) {
            toUser = await User.create({email: toAddress});
            const wallet = sdkInstance.createWalletAddress();
            toUser = await toUser.update({
                        publicKey: wallet.publicKey(),
                        privateKey: wallet.secret()
                    });
        }
        const senderKeypair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
        const receiverPublicKey = toUser.publicKey;

        const shareChallengeRes = await sdkInstance.shareChallenge(senderKeypair, challengeUuid, receiverPublicKey);
        awsEmail.sendMail(keys.from, toAddress, {challengeTitle: challenge.data.challenge.name});
        res.status(200).send({sharedChallenge: shareChallengeRes.data});
    },

    async redeem({params}, res) {
        const sponsorAddress = params.sponsorAddress;
        const challengeUuid = params.challengeUuid;

        const challenge = await sdkInstance.retrieveChallenge(challengeUuid);

        const sponsor = await User.findOne({where: {email: sponsorAddress}});
        const sponsorKeypair = stellarSDK.Keypair.fromSecret(sponsor.privateKey);

        const redeemChallengeResponse = await sdkInstance.redeemChallenge(sponsorKeypair, challengeUuid);
        const redeemTransactionUuid = redeemChallengeResponse.data.redeemTransaction.uuid;

        handleProvenance(redeemTransactionUuid, challenge.data.challenge);
        const sponsoredChallenges = redeemChallengeResponse.data.sponsoredChallenges;
        const heldChallenges = redeemChallengeResponse.data.heldChallenges;
        res.status(200).send({sponsoredChallenges, heldChallenges});
    }
};