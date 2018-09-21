'use strict';

const prompt = require('prompt');
const axios = require('axios');

const testNet = 'http://localhost:8000/api';

let userUuid;

function createUser () {
    console.log('Welcome to the nCent Hybrid Meta-App! Please enter your information below:');
    prompt.get(['username', 'email', 'company'], function(err, result) {
        axios.post(testNet + '/users', {
            userName: result.username,
            emailAddress: result.email,
            company: result.company
        })
        .then(function(userData) {
            userUuid = userData.data.uuid;
            console.log(`Welcome, ${userData.data.userName}!`);
            console.log('Please input the parameters for the Challenge that you want to create with our app!');
            prompt.get(['challengeTitle', 'totalRewardAmount', 'totalRewardUnits', 'description'], function(err2, result2) {
                axios.post(testNet + '/challenges', {
                    challengeTitle: result2.challengeTitle,
                    totalRewardAmount: result2.totalRewardAmount,
                    totalRewardUnits: result2.totalRewardUnits,
                    challengeDescription: result2.description,
                    sponsorId: userUuid
                })
                .then(function(challengeData) {
                    axios.get(testNet + `/users`)
                    .then(function(users) {
                        console.log(users.data);
                    })
                    .catch(function(error) {
                        console.log(error.message);
                    });
                })
                .catch(function(error) {
                    console.log(error.message);
                });
            });
        })
        .catch(function(error) {
            console.log(error.message);
        });
    });
}

prompt.start();
createUser();