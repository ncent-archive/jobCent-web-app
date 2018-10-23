const challengesController = require('../controllers').challenges;
const usersController = require('../controllers').users;
const sessionController = require("../controllers/").session;

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

    // creates a new user account with a Stellar wallet key pair
    app.post("/api/users", usersController.create);

    // gets user data, including sponsored and "held" challenges
    app.get("/api/users/:uuid", usersController.getOne);

    // verifies confirmation code and logs the user in
    app.post("/api/session", sessionController.create);

    // logs the user out
    app.delete("/api/session", sessionController.destroy);
};