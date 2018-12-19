const ChallengeUser = require("../models").ChallengeUser;
const sessionController = require("../controllers/").session;
const verifyLightFunc = require("./../controllers/session.js").verifyLight;

module.exports = {
    async setTokensPerReferral(req, res) {
        if (verifyLightFunc(req, res)) {
            
            const challengeUser = await ChallengeUser.findOne({
                where: {
                    userUuid: req.params.userUuid,
                    challengeUuid: req.params.challengeUuid
                }
            });
            if (!challengeUser) {
                return res.status(404).send({message: "Referral Code not found"});
            }
    
            await challengeUser.updateAttributes({tokensPerReferral: req.body.tokensPerReferral});
    
            return res.status(200).send({
                challengeUser
            });
        } else {
            return res.status(403).send({
                message: "User not logged in"
            });
        }

    },
    async getReferralCode(req, res) {
        console.log("getReferralCode in challengeUsers.js running");
        if (verifyLightFunc(req, res)) {
            console.log("in getReferralCode in challengeUsers.js, req is", req.params);
            const challengeUser = await ChallengeUser.findOne({
                where: {
                    userUuid: req.params.userUuid,
                    challengeUuid: req.params.challengeUuid
                }
            });
    
            if (!challengeUser) {
                return res.status(404).send({message: "Referral Code not found"});
            }
    
            return res.status(200).send({
                challengeUser
            });

        } else {
            return res.status(403).send({
                message: "User not logged in"
            });
        }

    }
}
