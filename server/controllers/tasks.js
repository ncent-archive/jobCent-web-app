const Task = require('../models').Task;

module.exports = {
    create(req, res) {
        return Task
            .create({
                taskName: req.body.taskName,
                requirements: req.body.requirements,
                submissionPeriodMins: req.body.submissionPeriodMins,
                percentOfTotalRewards: req.body.percentOfTotalRewards,
                numFinalists: req.body.numFinalists
            })
            .then(task => res.status(200).send(task))
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return Task
            .findAll({
                include: [{
                    model: Poll,
                    as: 'poll',
                    attributes: ['uuid']
                }],
            })
            .then(task => res.status(200).send(task))
            .catch(error => res.status(400).send(error));
    },
    retrieve(req, res) {
        return Task
            .findById(req.params.uuid, {
                include: [{
                    model: Poll,
                    as: 'poll',
                    attributes: ['uuid']
                }],
            })
            .then(task => {
                if (!task) {
                    return res.status(404).send({
                        message: 'Task Not Found',
                    });
                }
                return res.status(200).send(task);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        return Task
            .findById(req.params.uuid, {
                include: [{
                    model: Poll,
                    as: 'poll',
                    attributes: ['uuid']
                }],
            })
            .then(task => {
                if (!task) {
                    return res.sendFile(__dirname + '/public/errorpage.html');
                }
                return task
                    .update({
                        taskName: req.body.taskName || task.taskName,
                        requirements: req.body.requirements || task.requirements,
                        submissionPeriodMins: req.body.submissionPeriodMins || task.submissionPeriodMins,
                        percentOfTotalRewards: req.body.percentOfTotalRewards || task.percentOfTotalRewards,
                        numFinalists: req.body.numFinalists || task.numFinalists
                    })
                    .then(task => {
                        res.sendFile(__dirname + '/public/index.html');
                    })
                    .catch((error) => res.sendFile(__dirname + '/public/errorpage.html'));
            })
            .catch((error) => res.sendFile(__dirname + '/public/errorpage.html'));
    }
};