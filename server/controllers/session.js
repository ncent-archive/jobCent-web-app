const User = require("../models").User;
const bcrypt = require("bcrypt");

module.exports = {
    create(req, res) {
        const emailAddr = req.body.user.email;
        User.findOne({ where: { email: emailAddr } })
            .then(user => {
                if (user) {
                    if (user.active) {
                        const userInfo = {
                            uuid: user.dataValues.uuid,
                            email: user.dataValues.email,
                            publicKey: user.dataValues.publicKey,
                            name: user.dataValues.name
                        };
                        req.session.user = userInfo;
                        return res.status(200).send({user: userInfo});
                    }
                    const confirmationCode = req.body.user.code;
                    const expired = Date.now() > user.otpExp;
                    const validCode =
                        bcrypt.compareSync(confirmationCode, user.otpKey) && !expired;
                    console.log("expired? " + expired);
                    console.log("is the code valid? " + validCode);
                    if (validCode) {
                        console.log("code valid! logging in...");
                        //since user confirmed their email via the code, set their status to active
                        user
                            .update({
                                active: true
                            })
                            .then(user => {
                                const userInfo = {
                                    uuid: user.dataValues.uuid,
                                    email: user.dataValues.email,
                                    publicKey: user.dataValues.publicKey,
                                    name: user.dataValues.name
                                };
                                req.session.user = userInfo;
                                res.send({ user: userInfo });
                            });
                    } else {
                        res.status(400).send(
                            [
                                "That doesn't look like the code we sent to " + emailAddr
                            ]
                        );
                    }
                } else {
                    res.status(400).send({ errors: ["user not found"] });
                }
            })
            .catch(error => res.status(400).send(error));
    },
    async destroy(req, res) {
        console.log(req.session.user, req.cookies.session_token);
        if (req.session.user && req.cookies.session_token) {
            const user = await User.find({where: {email: req.session.user.email}});
            const loggedOutUser = await user.updateAttributes({active: false});
            res.clearCookie("session_token");
            res.status(200).send("Logged out successfully");
        } else {
            res.status(403).send("No user logged in to log out!");
        }
    },
    verify(req, res) {
        if (req.session.user && req.cookies.session_token) {
            return res.status(200).send({sessionVerified: true, user: req.session.user});
        }

        return res.status(403).send({sessionVerified: false});
    }
};
