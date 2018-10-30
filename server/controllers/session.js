const User = require("../models").User;
const bcrypt = require("bcrypt");

module.exports = {
    create(req, res) {
        const emailAddr = req.body.user.email;
        User.findOne({ where: { email: emailAddr } })
            .then(user => {
                if (user) {
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
    destroy(req, res) {
        if (req.session.user && req.cookies.session_token) {
            res.clearCookie("session_token");
            res.status(200).send("Logged out successfully");
        } else {
            res.status(404).send("No user logged in to log out!");
        }
    }
};
