const User = require("../models").User;
const Challenge = require("../models").Challenge;
const otplib = require("otplib");
const bcrypt = require("bcrypt");
const keys = require("./secret.js");
const awsEmail = require("./awsEmail.js");
const nCentSDK = require("ncent-sandbox-sdk");
const nCentSDKInstance = new nCentSDK("http://localhost:8010/api");
const _ = require("lodash");

function retrieveWalletBalance(
  tokenTypes,
  currentTokenTypeIndex,
  totalTokenTypes,
  publicKey,
  balances,
  callback
) {
  const currentTokenType = tokenTypes[currentTokenTypeIndex];
  if (currentTokenTypeIndex <= totalTokenTypes - 1) {
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

function retrieveProvenanceChain (
    transactions,
    currentTransactionIndex,
    totalTransactions,
    pChains,
    callback
) {
    const currentTransaction = transactions[currentTransactionIndex];
    if (currentTransactionIndex <= totalTransactions - 1) {
        if (currentTransaction.fromAddress === currentTransaction.toAddress) {
            pChains.push([currentTransaction]);
            retrieveProvenanceChain(transactions, currentTransactionIndex + 1, totalTransactions, pChains, callback);
        } else {
            nCentSDKInstance.retrieveProvenanceChain(currentTransaction.uuid)
            .then(function(retrievePChainResponse) {
                pChains.push(retrievePChainResponse.data);
                retrieveProvenanceChain(transactions, currentTransactionIndex + 1, totalTransactions, pChains, callback);
            })
            .catch(err => {
                retrieveProvenanceChain(transactions, currentTransactionIndex + 1, totalTransactions, pChains, callback);
            })
        }
    } else {
      callback(pChains);
    }
}

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
            console.log("user otp updated");
            const validCode = bcrypt.compareSync(token, tokenHash);
            console.log(token);

            console.log("initially valid? " + validCode);
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
              console.log("storing keys..");
              return data.user.update({
                publicKey: data.publicKey,
                privateKey: data.privateKey
              });
            })
            .then(user => {
              const validCode = otplib.authenticator.check(token, otpKey);
              console.log(token);
              console.log("initially valid? " + validCode);

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
              console.log("storing keys..");
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
        res.status(400).send({ errors: ["Invalid email address"] });
      }
    });
  },

  getOne(req, res) {
    User.findOne({
      where: { uuid: req.params.uuid },
      include: [{ model: Challenge, as: "sponsoredChallenges" }]
    }).then(user => {
      let walletBalances = [];
      let tokenTypes;
      let tokenTypeAmount;
      let challenges;
      // let challengesHeld = [];
      nCentSDKInstance
        .getTokenTypes()
        .then(function(tokenTypesResponse) {
          tokenTypes = tokenTypesResponse.data;
          tokenTypeAmount = tokenTypes.length;
          
          // Returns all transactions associated with the user  
          challenges = tokenTypes.filter(tokenType => {
              const tokenTransactions = tokenType.transactions;

              for (let i = 0; i < tokenTransactions.length; i++) {
                const tokenTransaction = tokenTransactions[i];
                if (
                  tokenTransaction.fromAddress === user.publicKey ||
                  tokenTransaction.toAddress === user.publicKey
                ) {
                  return true;
                }
              }
              return false;
            });

            retrieveWalletBalance(
                tokenTypes,
                0,
                tokenTypeAmount,
                user.publicKey,
                walletBalances,
                function(balances) {
                    res.status(200).send({
                        balance: balances,
                        sponsoredChallenges: user.sponsoredChallenges,
                        challenges
                    });
                }
            );
            // challenges.forEach((challenge, index) => {
            //   const { transactions } = challenge;
            //   retrieveProvenanceChain(transactions, 0, transactions.length, [], function(pChains) {
            //       for (let i = 0; i < transactions.length; i++) {
            //           const transaction = transactions[i];
            //           const pChain = pChains[i];
            //           if (transaction.toAddress !== user.publicKey || !pChain) {
            //               continue;
            //           }
            //           if (pChain[pChain.length -1].toAddress === user.publicKey && pChain[pChain.length - 1].fromAddress !== user.publicKey) {
            //               challengesHeld.push(challenge);
            //           }
            //       }
            //       retrieveWalletBalance(
            //           tokenTypes,
            //           0,
            //           tokenTypeAmount,
            //           user.publicKey,
            //           walletBalances,
            //           function(balances) {
            //               balancesArr += balances;
            //               if (index === challenges.length - 1) {
            //                   res.status(200).send({
            //                       balance: balancesArr,
            //                       sponsoredChallenges: user.sponsoredChallenges,
            //                       challenges,
            //                       challengesHeld
            //                   });
            //               }
            //           }
            //       );
            //   })
            });
        })
        .catch(error => {
          console.log("Error: " + error);
          res.status(400).send(error.response);
        });
      // in the future update this to use session tokens for search
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
