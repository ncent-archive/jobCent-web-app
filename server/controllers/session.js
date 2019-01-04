const User = require("../models").User;
const bcrypt = require("bcrypt");
const saltRounds = 12;

module.exports = {
    create(req, res) {
        const email = req.body.user.email;
        const password = req.body.user.password;
        console.log("top of create(login) in session.js", "email is", email, "password is", password, "user is ", req.body.user);
        User.findOne({ where: { email: email }})
            .then(user => {
                console.log("user returned in create in session.js", user);
                if (user) {
                    if (bcrypt.compareSync(password, user.hash)) {
                        console.log("user found in create in session.js, password match");
                        user.update({ active: true })
                            .then(user => {
                                let userObj = {
                                    uuid: user.dataValues.uuid,
                                    email: user.dataValues.email,
                                    publicKey: user.dataValues.publicKey,
                                    name: user.dataValues.name
                                };
                                req.session.user = userObj;
                                res.send(userObj);
                                console.log("in create in session.js, just set session and sent userObj to frontend.");
                            });
                    } else {
                        console.log("password mismatch in session.js in create");
                        res.status(403).send({error: "Username and password do not match."});
                    }
                } else {
                    console.log("user NOT found in create in session.js");
                    res.status(403).send({error: "User not found."});
                }
            }).catch(err => {
                console.log("error in create in session.js, .catch", err);
                res.status(403).send({error: "Error in create session.js"});
            });
        // User.findOne({ where: { email: email } })
        //     .then(user => {
        //         if (user) {
        //             if (user.active) {
        //                 const userInfo = {
        //                     uuid: user.dataValues.uuid,
        //                     email: user.dataValues.email,
        //                     publicKey: user.dataValues.publicKey,
        //                     name: user.dataValues.name
        //                 };
        //                 req.session.user = userInfo;
        //                 // req.session.user = userInfo.uuid;
        //                 return res.status(200).send({user: userInfo});
        //             }
        //             const confirmationCode = req.body.user.code;
        //             const expired = Date.now() > user.otpExp;
        //             const validCode =
        //                 bcrypt.compareSync(confirmationCode, user.otpKey) && !expired;
        //             console.log("expired? " + expired);
        //             console.log("is the code valid? " + validCode);
        //             if (validCode) {
        //                 console.log("code valid! logging in...");
        //                 //since user confirmed their email via the code, set their status to active
        //                 user
        //                     .update({
        //                         active: true
        //                     })
        //                     .then(user => {
        //                         const userInfo = {
        //                             uuid: user.dataValues.uuid,
        //                             email: user.dataValues.email,
        //                             publicKey: user.dataValues.publicKey,
        //                             name: user.dataValues.name
        //                         };
        //                         req.session.user = userInfo;
        //                         res.send({ user: userInfo });
        //                     });
        //             } else {
        //                 res.status(400).send(
        //                     [
        //                         "That doesn't look like the code we sent to " + emailAddr
        //                     ]
        //                 );
        //             }
        //         } else {
        //             res.status(400).send({ errors: ["user not found"] });
        //         }
        //     })
        //     .catch(error => res.status(400).send(error));
    },
    async destroy(req, res) {
        if (req.session.user && req.cookies.session_token) {
            const user = await User.find({where: {email: req.session.user.email}});
            const loggedOutUser = await user.updateAttributes({active: false});
            res.clearCookie("session_token");
            req.session.destroy();
            res.status(200).send("Logged out successfully.");
        } else {
            res.status(403).send("No user session detected.");
        }
    },
    verify(req, res) {
        console.log("verify in session.js, req.session.user", req.session.user, "req.cookies.session_token", req.cookies.session_token, "req.body.user", req.body.user);
        if (req.session.user && req.cookies.session_token) {
            console.log("verify in session.js returning true");
            return res.status(200).send({sessionVerified: true, user: req.session.user});
        }

        console.log("verify in session.js returning false");
        return res.status(403).send({sessionVerified: false});
    },
    verifyLight(req, res) {
        if (!req.session.user || !req.cookies.session_token) {
            return false;
            console.log("verifyLight in session.js returning false");
        } else {
            return true;
            console.log("verifyLight in session.js returning false");
        }
    }
};
