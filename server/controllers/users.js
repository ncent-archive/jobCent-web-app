const _ = require("lodash");
const User = require("../models").User;
const otplib = require("otplib");
const bcrypt = require("bcrypt");
const keys = require("./secret.js");
const awsEmail = require("./awsEmail.js");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK("http://localhost:8010/api");

module.exports = {
  otplib: otplib,
  create(req, res) {
    const otpKey = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(otpKey);
    // in the future write a parser to validate email address format.
    const validEmail = true;
    const html = "your jobCent confirmation code is: <b>" + token + "</b>";
    const otpExp = Date.now() + 300000;
    const salt = bcrypt.genSaltSync();
    const tokenHash = bcrypt.hashSync(token, salt);
    const emailAddr = req.body.user.email;
    const otpReq = req.body.user.otpReq;

    User.findOne({ where: { email: emailAddr } }).then(user => {
      if (user) {
        return user
          .update({
            otpKey: tokenHash,
            otpExp: otpExp
          })
          .then(user => {
            const validCode = bcrypt.compareSync(token, tokenHash);
            console.log(token);

            console.log("initially valid? " + validCode);
            awsEmail.sendMail(keys.from, emailAddr, {token});
            res.status(200).send(user.email);
          })
          .catch(error => res.status(400).send(error));
      } else if (validEmail) {
        let data = {};
        if (otpReq) {
          return User.create({
            email: emailAddr,
            otpKey: tokenHash,
            otpExp: otpExp
          })
            .then(user => {
              data.user = user;

              const wallet = nCentSDKInstance.createWalletAddress();
              data.privateKey = wallet.secret();
              data.publicKey = wallet.publicKey();
              return data;
            })
            .then(data => {
              return data.user.update({
                publicKey: data.publicKey,
                privateKey: data.privateKey
              });
            })
            .then(user => {
              const validCode = otplib.authenticator.check(token, otpKey);
              console.log(token);
              console.log("initially valid? " + validCode);

              awsEmail.sendMail(keys.from, emailAddr, {token});
              res.status(201).send(user);
            })
            .catch(error => {
              res.status(400).send(error);
            });
        } else {
          return User.create({
            email: emailAddr
          })
            .then(user => {
              data.user = user;

              const wallet = nCentSDKInstance.createWalletAddress();
              data.privateKey = wallet.secret();
              data.publicKey = wallet.publicKey();
              return data;
            })
            .then(data => {
              return data.user.update({
                publicKey: data.publicKey,
                privateKey: data.privateKey
              });
            })
            .then(user => {
              res.status(201).send(user);
            })
            .catch(error => {
              res.status(400).send(error);
            });
        }
      } else {
        res.status(400).send({ errors: ["Invalid email address"] });
      }
    });
  },

  async getOne(req, res) {
    const user = await User.findOne({
      where: { uuid: req.params.uuid }
    });
    const sponsoredChallenges = await nCentSDKInstance.retrieveSponsoredChallenges(user.publicKey);
    const heldChallenges = await nCentSDKInstance.retrieveHeldChallenges(user.publicKey);
    res.status(200).send(_.merge({}, sponsoredChallenges.data, heldChallenges.data));
  }
};
