const challengesController = require('../controllers').challenges;
const usersController = require('../controllers').users;
const sessionController = require("../controllers/").session;
const challengeUsersController = require("../controllers/").challengeUsers;
module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the nCent Hybrid Meta-App API!'
    }));


    // create/sponsor a challenge
    app.post('/api/challenges', challengesController.create);

    // share a challenge invite with another user
    app.patch('/api/challenges/:challengeUuid', challengesController.share);

    // redeems a challenge if you are the sponsor
    // rewards will be distributed across the provenance chain
    app.post('/api/challenges/:challengeUuid/:sponsorAddress', challengesController.redeem);

    app.get('/api/challenges/balances/:challengeUuid', challengesController.retrieveChallengeUsers);

    app.put('/api/challenges/referralCode/:referralCode', challengesController.redeemReferralCode);

    // creates a new user account with a Stellar wallet key pair
    app.post("/api/users", usersController.create);

    // gets user data, including sponsored and "held" challenges
    app.get("/api/users/:uuid", usersController.getOne);

    app.get("/api/challengeUsers/:userUuid/:challengeUuid", challengeUsersController.getReferralCode);

    // logs the user in from login page
    app.post("/api/session", sessionController.create);

    // logs in user via session
    app.post("/api/session/confirm", sessionController.verify);

    // logs the user out
    app.delete("/api/session", sessionController.destroy);

    app.get("/api/session", sessionController.verify);

    app.patch("/api/challengeUsers/:userUuid/:challengeUuid", challengeUsersController.setTokensPerReferral)
};
