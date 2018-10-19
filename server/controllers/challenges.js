const User = require("../models").User;
const ncentSDK = require('ncent-sandbox-sdk');
const stellarSDK = require('stellar-sdk');
const sdkInstance = new ncentSDK('http://localhost:8010/api');

module.exports = {
    async create(req, res) {
        let tokenTypeUuid;
        const expiration = '2020';
        const { senderPublicKey, name, rewardAmount } = req.body;
        const rewardAmountInt = parseInt(rewardAmount);
        const user = await User.findOne({where: {publicKey: senderPublicKey}});
        const senderKeypair = stellarSDK.Keypair.fromSecret(user.privateKey);
        console.log(senderKeypair.publicKey());
        const stampResponse = await sdkInstance.stampToken(senderPublicKey, name, rewardAmountInt, expiration);
        tokenTypeUuid = stampResponse.data.tokenType.uuid;
        const createChallengeResponse = await sdkInstance.createChallenge(senderKeypair, name, expiration, tokenTypeUuid, rewardAmountInt);
        res.status(200).send(createChallengeResponse);
    }
};