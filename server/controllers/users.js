const User = require('../models').User;
const Challenge = require('../models').Challenge;

module.exports = {
    create(req, res) {
        return User
            .create({
                userName: req.body.userName,
                emailAddress: req.body.emailAddress,
                company: req.body.company
            })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return User
            .findAll({
                include: [{
                    model: Challenge,
                    as: 'challenges',
                    attributes: ['uuid']
                }],
            })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send(error));
    },
    retrieve(req, res) {
        return User
            .findById(req.params.uuid, {
                include: [{
                    model: Challenge,
                    as: 'challenges',
                    attributes: ['uuid']
                }],
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        return User
            .findById(req.params.uuid, {
                include: [{
                    model: Challenge,
                    as: 'challenges',
                    attributes: ['uuid']
                }],
            })
            .then(user => {
                if (!user) {
                    return res.sendFile(__dirname + '/public/errorpage.html');
                }
                return user
                    .update({
                        userName: req.body.userName || user.userName,
                        emailAddress: req.body.emailAddress || user.emailAddress,
                        company: req.body.company || user.company
                    })
                    .then(user => {
                        res.sendFile(__dirname + '/public/index.html');
                    })
                    .catch((error) => res.sendFile(__dirname + '/public/errorpage.html'));
            })
            .catch((error) => res.sendFile(__dirname + '/public/errorpage.html'));
    }
};