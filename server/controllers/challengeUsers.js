const ChallengeUser = require("../models").ChallengeUser;
const sessionController = require("../controllers/").session;
const verifyLightFunc = require("./../controllers/session.js").verifyLight;

module.exports = {
    async setTokensPerReferral(req, res) {
        if (verifyLightFunc) {
            
            const challengeUser = await ChallengeUser.findOne({
                where: {
                    userUuid: req.params.userUuid,
                    challengeUuid: req.params.challengeUuid
                }
            });
            if (!challengeUser) {
                return res.status(404).send({message: "Referral Code not found"});
            }
            //Ned to Set the value wher
    
            await challengeUser.updateAttributes({tokensPerReferral: req.body.tokensPerReferral});
    
            return res.status(200).send({
                challengeUser
            });
        }

    },
    async getReferralCode(req, res) {
        if (verifyLightFunc) {
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

        }
        
    }
}
