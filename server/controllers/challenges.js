const _ = require('lodash');
const User = require("../models").User;
const ChallengeUser = require("../models").ChallengeUser;
const ncentSDK = require('ncent-sandbox-sdk');
const stellarSDK = require('stellar-sdk');
const sdkInstance = new ncentSDK('http://localhost:8010/api');
const keys = require("./secret.js");
const awsEmail = require("./awsEmail.js");
const voucherCodes = require('voucher-code-generator');

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

        const challengeUser = await ChallengeUser.findOne({
            where: {
                userUuid: toUser.uuid,
                challengeUuid
            }
        });

        if (!challengeUser) {
            await createReferralCode(toUser.uuid, challenge);
        }

        awsEmail.sendMail(keys.from, toAddress, {challengeTitle: challenge.data.challenge.name, description: challenge.data.challenge.description, fromAddress, rewardAmount: challenge.data.challenge.rewardAmount/2, participationUrl: challenge.data.challenge.participationUrl, company: challenge.data.challenge.company});
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

    async retrieveChallengeUsers({params}, res) {
        let challengeUsers = [];
        let challengeUserUuids = [];
        const challengeBalancesResp = await sdkInstance.retrieveAllChallengeBalances(params.challengeUuid);
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
    },

    async redeemReferralCode({params, body}, res) {
        const referralCode = params.referralCode;
        const recipientUuid = body.recipientUuid;
        const challengeUser = await ChallengeUser.findOne({
            where: {
                referralCode
            }
        });

        if (!challengeUser) {
            return res.status(403).send({message: "invalid referral code"});
        }

        const challenge = await sdkInstance.retrieveChallenge(challengeUser.challengeUuid);

        const fromUser = await User.findOne({
            where: {
                uuid: challengeUser.userUuid
            }
        });

        const toUser = await User.findOne({
            where: {
                uuid: recipientUuid
            }
        });


        const senderKeypair = stellarSDK.Keypair.fromSecret(fromUser.privateKey);

        const shareChallengeRes = await sdkInstance.shareChallenge(senderKeypair, challengeUser.challengeUuid, toUser.publicKey, 1);
        awsEmail.sendMail(keys.from, toUser.email, {challengeTitle: challenge.name, description: challenge.description, fromAddress: fromUser.email, rewardAmount: challenge.rewardAmount/2, participationUrl: challenge.participationUrl, company: challenge.company});
        res.status(200).send({sharedChallenge: shareChallengeRes.data});
    }
};