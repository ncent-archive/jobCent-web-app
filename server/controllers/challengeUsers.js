const ChallengeUser = require("../models").ChallengeUser;


module.exports = {
    async setTokensPerReferral({params, body}, res) {
        const challengeUser = await ChallengeUser.findOne({
            where: {
                userUuid: params.userUuid,
                challengeUuid: params.challengeUuid
            }
        });
        if (!challengeUser) {
            return res.status(404).send({message: "Referral Code not found"});
        }
        //Ned to Set the value wher

        await challengeUser.updateAttributes({tokensPerReferral: body.tokensPerReferral});

        return res.status(200).send({
            challengeUser})
    },
    async getReferralCode({params}, res) {
        const challengeUser = await ChallengeUser.findOne({
            where: {
                userUuid: params.userUuid,
                challengeUuid: params.challengeUuid
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
