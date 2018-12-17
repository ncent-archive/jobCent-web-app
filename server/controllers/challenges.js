const { verify } = require('stellar-base');

const _ = require('lodash');
const User = require("../models").User;
const ChallengeUser = require("../models").ChallengeUser;
const CodeRedemption = require("../models").CodeRedemption;
const ncentSDK = require('ncent-sandbox-sdk');
const stellarSDK = require('stellar-sdk');
const sdkInstance = new ncentSDK('http://localhost:8010/api');
const keys = require("./secret.js");
const awsEmail = require("./awsEmail.js");
const voucherCodes = require('voucher-code-generator');
const sessionController = require("../controllers/").session;
const verifyLightFunc = require("./../controllers/session.js").verifyLight;

function formatDollars(amount) {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

const handleProvenance = async (challenge, redeemTransactionUuid) => {
    const pChainResp = await sdkInstance.retrieveProvenanceChain(redeemTransactionUuid);
    const pChain = pChainResp.data;
    const sponsor = await User.find({where: {publicKey: challenge.sponsorWalletAddress}});
    const sponsorEmail = sponsor.email;
    const redemptionInfo = {};
    let challengeReward = parseFloat(challenge.rewardAmount) / 2.0;
    for (let i = pChain.length - 2; i >= 0; i--) {
        if (pChain[i].parentTransaction) {
            const recipient = await User.findOne({where: {publicKey: pChain[i].toAddress}});
            awsEmail.sendMail(keys.from, recipient.email, {reward: challengeReward, rewardTitle: challenge.name, email: sponsorEmail});
            redemptionInfo[recipient.email] = challengeReward;
            challengeReward = challengeReward / 2.0;
        } else {
            let redemptionInfoHtml = "";
            const redemptionInfoKeys = Object.keys(redemptionInfo);
            redemptionInfoKeys.forEach(key => {
                redemptionInfoHtml += `${key} won $${formatDollars(redemptionInfo[key])}` + "<br>";
            });
            awsEmail.sendMail(keys.from, sponsorEmail, {redemptionInfoHtml, redemptionChallengeTitle: challenge.name});
        }
    }
};

const createReferralCode = async (userUuid, challenge) => {
    const challengeUuid = challenge.uuid;

    const referralCode = voucherCodes.generate({
        prefix: `${challenge.name}-`,
        postfix: `-${challenge.company}`
    });
    return await ChallengeUser.create({
        userUuid,
        challengeUuid,
        referralCode: referralCode[0]
    });
};

module.exports = {
    async create(req, res) {
        console.log("create func in challenges.js, sessionController being imported is", sessionController);
        // sessionController.verifyLight(req, res);
        console.log("create func in challenges.js, verifyLightFunc being imported is", verifyLightFunc);
        if (verifyLightFunc(req, res)) {
            const {senderPublicKey, name, description, company, imageUrl, participationUrl, rewardAmount, maxShares, challengeDuration} = req.body;
    
            const rewardAmountInt = parseInt(rewardAmount);
            const maxSharesInt = parseInt(maxShares);
    
            const user = await User.findOne({where: {publicKey: senderPublicKey}});
            const senderKeypair = stellarSDK.Keypair.fromSecret(user.privateKey);
    
            const tokenTypes = await sdkInstance.getTokenTypes();
            const NCNT = tokenTypes.data.filter(tokenType => tokenType.name === "NCNT");
            const tokenTypeUuid = NCNT[0].uuid;
            const expiration = Date.now() + parseInt(challengeDuration)*24*60*60*1000;
    
            const createChallengeResponse = await sdkInstance.createChallenge(senderKeypair, name, description, company, imageUrl, participationUrl, expiration, tokenTypeUuid, rewardAmountInt, "NCNT", maxSharesInt);
            await createReferralCode(user.uuid, createChallengeResponse.data.challenge);
    
            res.status(200).send({challenge: createChallengeResponse.data});
        }
    },

    async share(req, res) {
        console.log("share func in challenges.js, verifyLightFunc is", verifyLightFunc);
        if (verifyLightFunc) {
            const {fromAddress, toAddress, numShares} = req.body;
            const challengeUuid = req.params.challengeUuid;
            const challengeResponse = await sdkInstance.retrieveChallenge(challengeUuid);
    
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
    
            const challengeUser = await ChallengeUser.findOne({
                where: {
                    userUuid: toUser.uuid,
                    challengeUuid
                }
            });
    
            if (!challengeUser) {
                await createReferralCode(toUser.uuid, challengeResponse.data.challenge);
            }
    
            awsEmail.sendMail(keys.from, toAddress, {challengeTitle: challengeResponse.data.challenge.name, description: challengeResponse.data.challenge.description, fromAddress, rewardAmount: challengeResponse.data.challenge.rewardAmount/2, participationUrl: challengeResponse.data.challenge.participationUrl, company: challengeResponse.data.challenge.company});
            res.status(200).send({sharedChallenge: shareChallengeRes.data});
        }
    },

    async redeem(req, res) {
        // sessionController.verifyLight(req, res);
        console.log("redeem func in challenges.js, verifyLightFunc is", verifyLightFunc);
        if (verifyLightFunc) {
            const {sponsorAddress, challengeUuid} = req.params;
            const redeemerAddress = req.body.redeemerAddress;
    
            const sponsor = await User.findOne({where: {email: sponsorAddress}});
            const sponsorKeypair = stellarSDK.Keypair.fromSecret(sponsor.privateKey);
    
            const redeemChallengeResponse = await sdkInstance.redeemChallenge(sponsorKeypair, challengeUuid, redeemerAddress);
            const redeemTransactionUuid = redeemChallengeResponse.data.redeemTransaction.uuid;
    
            const challenge = await sdkInstance.retrieveChallenge(challengeUuid);
    
            handleProvenance(challenge.data.challenge, redeemTransactionUuid);
            const sponsoredChallenges = redeemChallengeResponse.data.sponsoredChallenges;
            const heldChallenges = redeemChallengeResponse.data.heldChallenges;
            res.status(200).send({sponsoredChallenges, heldChallenges});
        }
    },

    async retrieveChallengeUsers(req, res) {
        console.log("retrieveChallengeUsers func in challenges.js, verifyLightFunc is", verifyLightFunc);
        if (verifyLightFunc) {
            let challengeUsers = [];
            let challengeUserUuids = [];
            const challengeBalancesResp = await sdkInstance.retrieveAllChallengeBalances(req.params.challengeUuid);
            if (challengeBalancesResp && challengeBalancesResp.status === 200) {
                const balanceAddresses = Object.keys(challengeBalancesResp.data.challengeBalances);
                if (balanceAddresses.length < 1) {
                    return res.status(200).send({challengeUsers: []});
                }
                balanceAddresses.forEach(async (balanceAddress, index) => {
                    let challengeUser = await User.find({where: {publicKey: balanceAddress}});
                    let challengeUserUuid = challengeUser.uuid;
                    if (!challengeUserUuids.includes(challengeUserUuid)) {
                        challengeUsers.push(challengeUser);
                        challengeUserUuids.push(challengeUserUuid);
                    }
                    if (index === balanceAddresses.length - 1) {
                        return res.status(200).send({challengeUsers});
                    }
                });
            } else {
                return res.status(404).send({message: "Challenge users not found"});
            }
        }
    },

    async redeemReferralCode(req, res) {
        console.log("redeemReferralCode func in challenges.js, verifyLightFunc is", verifyLightFunc);
        if (verifyLightFunc(req, res)) {
            const referralCode = req.params.referralCode;
            const recipientUuid = req.body.recipientUuid;
            const challengeUser = await ChallengeUser.findOne({
                where: {
                    referralCode
                }
            });
            const numShares = challengeUser.tokensPerReferral;
    
            if (!challengeUser) {
                return res.status(403).send({message: "invalid referral code"});
            }
    
            const redemption = await CodeRedemption.findOne({
                where: {
                    referralCode,
                    userUuid: recipientUuid
                }
            });
    
            if (redemption) {
                return res.status(403).send({message: "user has already redeemed this code"});
            }
            const challenge = await sdkInstance.retrieveChallenge(challengeUser.challengeUuid);
    
            const fromUser = await User.findOne({
                where: {
                    uuid: challengeUser['userUuid']
                }
            });
    
            const toUser = await User.findOne({
                where: {
                    uuid: recipientUuid
                }
            });
    
            const senderKeypair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);
    
            const shareChallengeRes = await sdkInstance.shareChallenge(senderKeypair, challengeUser['challengeUuid'], toUser.publicKey, numShares);
            await createReferralCode(toUser.uuid, challenge.data.challenge);
            await CodeRedemption.create({
                referralCode,
                userUuid: recipientUuid
            });
    
            awsEmail.sendMail(keys.from, toUser.email, {challengeTitle: challenge.name, description: challenge.description, fromAddress: fromUser.email, rewardAmount: challenge.rewardAmount/2, participationUrl: challenge.participationUrl, company: challenge.company});
            res.status(200).send({sharedChallenge: shareChallengeRes.data});
        }
    }
};