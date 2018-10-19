const challengesController = require('../controllers').challenges;
const tasksController = require('../controllers').tasks;
const usersController = require('../controllers').users;
const sessionController = require("../controllers/").session;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the nCent Hybrid Meta-App API!'
    }));

    app.post('/api/challenges', challengesController.create);
    app.patch('/api/challenges/:challengeUuid', challengesController.share);
    app.post('/api/challenges/:challengeUuid/:sponsorAddress', challengesController.redeem);

    app.get('/api/tasks', tasksController.list);
    app.get('/api/tasks/:uuid', tasksController.retrieve);
    app.post('/api/tasks', tasksController.create);
    app.patch('/api/tasks/:uuid', tasksController.update);

    app.post("/api/users", usersController.create);
    // verify confirmation code and login user
    app.post("/api/session", sessionController.create);
    // get token balance and user data
    app.get("/api/users/:uuid", usersController.getOne);
    // logout user
    app.delete("/api/session", sessionController.destroy);
};