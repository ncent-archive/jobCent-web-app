const User = require('../models').User;
const Challenge = require('../models').Challenge;
const otplib = require('otplib');
const bcrypt = require('bcrypt');
const keys = require('./secret.js');
const awsEmail = require('./awsEmail.js');
const nCentSDK = require('ncent-sandbox-sdk');
const nCentSDKInstance = new nCentSDK('http://localhost:8010/api');
const _ = require('lodash');

function retrieveWalletBalance(
  tokenTypes,
  currentTokenTypeIndex,
  totalTokenTypes,
  publicKey,
  balances,
  callback
) {
  const currentTokenType = tokenTypes[currentTokenTypeIndex];
  if (currentTokenTypeIndex <= totalTokenTypes) {
    nCentSDKInstance
      .getWalletBalance(publicKey, currentTokenType.uuid)
      .then(function(walletBalanceResponse) {
        balances.push({
          tokenTypeUuid: currentTokenType.uuid,
          tokenName: currentTokenType.name,
          balance: walletBalanceResponse.data.balance
        });
        retrieveWalletBalance(
          tokenTypes,
          currentTokenTypeIndex + 1,
          totalTokenTypes,
          publicKey,
          balances,
          callback
        );
      });
  } else {
    callback(balances);
  }
}

module.exports = {
  otplib: otplib,
  create(req, res) {
    const otpKey = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(otpKey);
    // in the future write a parser to validate email address format.
    const validEmail = true;
    const html = 'your jobCent confirmation code is: <b>' + token + '</b>';
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
            console.log('user otp updated');
            const validCode = bcrypt.compareSync(token, tokenHash);
            console.log(token);

            console.log('initially valid? ' + validCode);
            awsEmail.sendMail(keys.from, emailAddr, token);
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
              console.log('storing keys..');
              return data.user.update({
                publicKey: data.publicKey,
                privateKey: data.privateKey
              });
            })
            .then(user => {
              const validCode = otplib.authenticator.check(token, otpKey);
              console.log(token);
              console.log('initially valid? ' + validCode);

              awsEmail.sendMail(keys.from, emailAddr, html);
              res.status(201).send(user);
            })
            .catch(error => {
              console.log(error.message);

              res.status(400).send(error);
            });
        } else {
          return User.create({
            email: emailAddr
          })
            .then(user => {
              data.user = user;
              console.log(user);

              const wallet = nCentSDKInstance.createWalletAddress();
              data.privateKey = wallet.secret();
              data.publicKey = wallet.publicKey();
              return data;
            })
            .then(data => {
              console.log('storing keys..');
              return data.user.update({
                publicKey: data.publicKey,
                privateKey: data.privateKey
              });
            })
            .then(user => {
              res.status(201).send(user);
            })
            .catch(error => {
              console.log(error);
              res.status(400).send(error);
            });
        }
      } else {
        res.status(400).send({ errors: ['Invalid email address'] });
      }
    });
  },

  getOne(req, res) {
    User.findOne({
      where: { uuid: req.params.uuid },
      include: [{ model: Challenge, as: 'sponsoredChallenges' }]
    }).then(user => {
      let walletBalances = [];
      let tokenTypes;
      let tokenTypeAmount;
      let challenges;
      let challengesHeld;
      nCentSDKInstance
        .getTokenTypes()
        .then(function(tokenTypesResponse) {
          tokenTypes = tokenTypesResponse.data;
          tokenTypeAmount = tokenTypes.length;
          
          // Returns all transactions associated with the user  
          challenges = tokenTypes
            // .map(tokenType => tokenType.transactions)
            .filter(tokenType => {
              const tokenTransactions = tokenType.transactions;

              for (let i = 0; i < tokenTransactions.length; i++) {
                const tokenTransaction = tokenTransactions[i];
                console.log(JSON.stringify(tokenTransaction));
                if (
                  tokenTransaction.fromAddress === user.publicKey ||
                  tokenTransaction.toAddress === user.publicKey
                ) {
                  return true;
                }
              }
              return false;
            });
            console.log(JSON.stringify(challenges));

            challengesHeld = challenges.filter(challenge => {
              const { transactions } = challenge;

              for (let i = 0; i < transactions.length; i++) {
                const transaction = transactions[i];

                if (transaction.toAddress !== user.publicKey) {
                  continue;
                }

                const pChain = nCentSDKInstance.retrieveProvenanceChain(transaction.uuid)
                console.log(pChain);

                if (pChain.length === 0) {
                  return true;
                }
              }
              return false;
            })

            

          retrieveWalletBalance(
            tokenTypes,
            0,
            tokenTypeAmount - 1,
            user.publicKey,
            walletBalances,
            function(balances) {
              res.status(200).send({
                balance: balances,
                sponsoredChallenges: user.sponsoredChallenges,
                challenges,
                challengesHeld
              });
            }
          );
        })
        .catch(error => {
          console.log(error.response.data);
          res.status(400).send(error.response.data);
        });
      // in the future update this to use session tokens for search
    });
  },
  update(req, res) {
    User.update(
      {
        name: req.body.user.name
      },
      { where: { email: req.body.user.from } }
    )
      .then(user => {
        console.log(user);
        res.status(200).send(user);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  }
};
