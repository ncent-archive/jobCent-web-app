const User = require("../models").User;
const bcrypt = require("bcrypt");
const otplib = require("otplib");
const keys = require("./secret.js");
const awsEmail = require("./awsEmail.js");
const saltRounds = 12;

module.exports = {
    sendMail(req, res) {
        const otpKey = otplib.authenticator.generateSecret();
        const token = otplib.authenticator.generate(otpKey);
        const html = "your jobCent confirmation code is: <b>" + token + "</b>";
        const otpExp = Date.now() + 300000;
        const salt = bcrypt.genSaltSync();
        const tokenHash = bcrypt.hashSync(token, salt);
        const email = req.body.email;
        return User.findOne({ where: { email: email }}).then(user => {
            console.log("in sendMail in session.js, looking for", email, req.body);
            if (!user) {
                return res.status(200).send({ error: "User does not exist." });
            }

            return user.update({
                otpKey: tokenHash,
                otpExp: otpExp
            }).then(user => {
                awsEmail.sendMail(keys.from, email, { token });
                console.log("in sendMail in session.js, just sent mail via aws");
                return res.status(200).send({ message: "Mail sent." });
            });
        });
    },
    create(req, res) {

        //                              Traditional user/pass login
        // const email = req.body.user.email.toLowerCase();
        // const password = req.body.user.password;
        // console.log("top of create(login) in session.js", "email is", email, "password is", password, "user is ", req.body.user);
        // User.findOne({ where: { email: email }})
        //     .then(user => {
        //         console.log("user returned in create in session.js", user);
        //         if (user) {
        //             if (user.hash === null) {
        //                 return;
        //             }
        //             if (bcrypt.compareSync(password, user.hash)) {
        //                 console.log("user found in create in session.js, password match");
        //                 user.update({ active: true })
        //                     .then(user => {
        //                         let userObj = {
        //                             uuid: user.dataValues.uuid,
        //                             email: user.dataValues.email,
        //                             publicKey: user.dataValues.publicKey,
        //                             name: user.dataValues.name
        //                         };
        //                         req.session.user = userObj;
        //                         res.send(userObj);
        //                         console.log("in create in session.js, just set session and sent userObj to frontend.");
        //                     });
        //             } else {
        //                 console.log("password mismatch in session.js in create");
        //                 res.status(403).send({error: "Username and password do not match."});
        //             }
        //         } else {
        //             console.log("user NOT found in create in session.js");
        //             res.status(403).send({error: "User not found."});
        //         }
        //     }).catch(err => {
        //         console.log("error in create in session.js, .catch", err);
        //         res.status(403).send({error: "There was an error. Please try again."});
        //     });

    //                                  Code-based login (magic link)
        const email = req.body.email;
        const confirmationCode = req.body.code;

        User.findOne({ where: { email: email } })
            .then(user => {
                if (!user) {
                    res.status(200).send({ error: "User not found." });
                } else {
                    console.log("user found in create in session.js", user);
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
                                res.status(200).send(userInfo);
                            });
                    } else {
                        res.status(403).send({ error: "Invalid code.\nYou can request another code if you like." });
                    }
                }
            })
            .catch(error => res.status(400).send(error));
        
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
        console.log("verify in session.js, req.session.user", req.session.user, "req.cookies.session_token", req.cookies.session_token);
        if (req.session.user && req.cookies.session_token) {
            console.log("verify in session.js returning true");
            return res.status(200).send({sessionVerified: true, user: req.session.user});
        }

        console.log("verify in session.js returning false");
        return res.status(403).send({sessionVerified: false});
    },
    verifyLight(req, res) {
        if (!req.session.user || !req.cookies.session_token) {
            console.log("verifyLight in session.js returning false");
            return false;
        } else {
            console.log("verifyLight in session.js returning true");
            return true;
        }
    }
};
