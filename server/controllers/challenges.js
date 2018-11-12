const _ = require('lodash');
const User = require("../models").User;
const ncentSDK = require('ncent-sandbox-sdk');
const stellarSDK = require('stellar-sdk');
const sdkInstance = new ncentSDK('http://localhost:8010/api');
const keys = require("./secret.js");
const awsEmail = require("./awsEmail.js");

const handleProvenance = async (challenge, redeemTransactionUuid) => {
    const pChainResp = await sdkInstance.retrieveProvenanceChain(redeemTransactionUuid);
    const pChain = pChainResp.data;
    const sponsor = await User.find({where: {publicKey: challenge.sponsorWalletAddress}});
    const sponsorEmail = sponsor.email;
    const redemptionInfo = {};
    let challengeReward = parseFloat(challenge.rewardAmount) / challenge.maxRedemptions / 2.0;
    for (let i = pChain.length - 2; i >= 0; i--) {
        console.log(pChain[i]);
        if (pChain[i].parentTransaction) {
            const recipient = await User.findOne({where: {publicKey: pChain[i].toAddress}});
            awsEmail.sendMail(keys.from, recipient.email, {reward: challengeReward, rewardTitle: challenge.name});
            redemptionInfo[recipient.email] = challengeReward;
            challengeReward = challengeReward / 2.0;
        } else {
            let redemptionInfoHtml = "";
            const redemptionInfoKeys = Object.keys(redemptionInfo);
            redemptionInfoKeys.forEach(key => {
                redemptionInfoHtml += `${key} won $${redemptionInfo[key]}` + "\n";
            });
            awsEmail.sendMail(keys.from, sponsorEmail, {redemptionInfoHtml, redemptionChallengeTitle: challenge.name});
        }
    }
};

module.exports = {
    async create(req, res) {
        const {senderPublicKey, name, description, company, imageUrl, participationUrl, rewardAmount, maxShares, maxRedemptions} = req.body;

        const rewardAmountInt = parseInt(rewardAmount);
        const maxSharesInt = parseInt(maxShares);
        const maxRedemptionsInt = parseInt(maxRedemptions);

        const user = await User.findOne({where: {publicKey: senderPublicKey}});
        const senderKeypair = stellarSDK.Keypair.fromSecret(user.privateKey);


        const tokenTypes = await sdkInstance.getTokenTypes();
        const NCNT = tokenTypes.data.filter(tokenType => tokenType.name === "NCNT");
        const tokenTypeUuid = NCNT[0].uuid;
        const expiration = '2020';

        const createChallengeResponse = await sdkInstance.createChallenge(senderKeypair, name, description, company, imageUrl, participationUrl, expiration, tokenTypeUuid, rewardAmountInt, "NCNT", maxSharesInt, maxRedemptionsInt);
        res.status(200).send({challenge: createChallengeResponse.data});
    },

    async share({body, params}, res) {
        const {fromAddress, toAddress, numShares} = body;
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

        const shareChallengeRes = await sdkInstance.shareChallenge(senderKeypair, challengeUuid, receiverPublicKey, numShares);
        awsEmail.sendMail(keys.from, toAddress, {challengeTitle: challenge.data.challenge.name});
        res.status(200).send({sharedChallenge: shareChallengeRes.data});
    },

    async redeem({params, body}, res) {
        const {sponsorAddress, challengeUuid} = params;
        const redeemerAddress = body.redeemerAddress;

        const sponsor = await User.findOne({where: {email: sponsorAddress}});
        const sponsorKeypair = stellarSDK.Keypair.fromSecret(sponsor.privateKey);

        const redeemChallengeResponse = await sdkInstance.redeemChallenge(sponsorKeypair, challengeUuid, redeemerAddress);
        const redeemTransactionUuid = redeemChallengeResponse.data.redeemTransaction.uuid;

        const challenge = await sdkInstance.retrieveChallenge(challengeUuid);

        handleProvenance(challenge.data.challenge, redeemTransactionUuid);
        const sponsoredChallenges = redeemChallengeResponse.data.sponsoredChallenges;
        const heldChallenges = redeemChallengeResponse.data.heldChallenges;
        res.status(200).send({sponsoredChallenges, heldChallenges});
    },

    async retrieveLeafNodeUsers({params}, res) {
        let leafNodeUsers = [];
        let leafNodeUserUuids = [];
        const leafNodesResp = await sdkInstance.retrieveLeafNodeTransactions(params.challengeUuid);
        if (leafNodesResp && leafNodesResp.status === 200) {
            if (leafNodesResp.data.leafNodeTransactions.length <= 0) {
                return res.status(200).send({leafNodeUsers});
            }
            leafNodesResp.data.leafNodeTransactions.forEach(async (transaction, index) => {
                let leafNodeUser = await User.find({where: {publicKey: transaction.toAddress}});
                let leafNodeUserUuid = leafNodeUser.uuid;
                if (!leafNodeUserUuids.includes(leafNodeUserUuid)) {
                    leafNodeUsers.push(leafNodeUser);
                    leafNodeUserUuids.push(leafNodeUserUuid);
                }
                if (index === leafNodesResp.data.leafNodeTransactions.length - 1) {
                    return res.status(200).send({leafNodeUsers});
                }
            });
        } else {
            return res.status(404).send({message: "Leaf nodes not found"});
        }
    }
};