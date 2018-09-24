'use strict';

const prompt = require('prompt');
const axios = require('axios');

const testNet = 'http://18.191.114.157:8000/api';

let userUuid;
let challengeUuid;
let challenge;
const tasks = [];
const winners = [];

function createUser () {
    console.log('Welcome to the nCent Hybrid Meta-App! Please enter your information below:');
    prompt.get(['username', 'email', 'company'], function(err, result) {
        axios.post(testNet + '/users', {
            userName: result.username,
            emailAddress: result.email,
            company: result.company
        })
        .then(createChallenge)
        .catch(function(error) {
            console.log(error.message);
        });
    });
}

function createChallenge (userData) {
    userUuid = userData.data.uuid;
    console.log(`Welcome, ${userData.data.userName}!`);
    console.log('Please input the parameters for the Challenge that you want to create with our app!');
    prompt.get(['challengeTitle', 'totalRewardAmount', 'totalRewardUnits', 'description'], function(err, result) {
        axios.post(testNet + '/challenges', {
            challengeTitle: result.challengeTitle,
            totalRewardAmount: result.totalRewardAmount,
            totalRewardUnits: result.totalRewardUnits,
            challengeDescription: result.description,
            sponsorId: userUuid
        })
        .then(createTasks)
        .catch(function(error) {
            console.log(error.message);
        });
    });
}

function createTasks (challengeData) {
    challengeUuid = challengeData.data.uuid;
    challenge = challengeData.data;
    console.log("Your challenge has been successfully created!");
    console.log("How many tasks will your challenge require?");
    prompt.get(['numberOfTasks'], function(err, result) {
        createTask(1, result.numberOfTasks);
    })
}

function createTask (currentTaskNumber, totalNumTasks) {
    if (currentTaskNumber > totalNumTasks) {
        console.log('Finished creating tasks');
        executeChallenge();
    } else {
        console.log(`Let's define task ${currentTaskNumber} of ${totalNumTasks}`);
        console.log('Please enter the task parameters below:');
        prompt.get(['taskName', 'requirements', 'submissionPeriodMins', 'percentOfTotalRewards', 'numFinalists'], function(err, result) {
            axios.post(testNet + '/tasks', {
                taskName: result.taskName,
                requirements: result.requirements,
                submissionPeriodMins: result.submissionPeriodMins,
                percentOfTotalRewards: result.percentOfTotalRewards,
                numFinalists: result.numFinalists,
                challengeUuid: challengeUuid
            })
            .then(function(taskData) {
                tasks.push(taskData.data);
                createTask(currentTaskNumber + 1, totalNumTasks);
            })
            .catch(function(error) {
                console.log(error.message);
            });
        })
    }
}

function executeChallenge() {
    console.log('Now starting your challenge');
    executeTask(1);
}

function executeTask(currentTaskNumber) {
    if (currentTaskNumber > tasks.length) {
        finishChallenge();
    } else {
        console.log(`Please collect submissions for ${tasks[currentTaskNumber - 1].taskName}`);
        console.log(`Please enter the the information about the winner when you are ready:`);
        prompt.get(['winnerUsername', 'filePath'], function(err, result) {
            winners.push({
                winnerUsername: result.winnerUsername,
                filePath: result.filePath
            });
            executeTask(currentTaskNumber + 1);
        })
    }
}

function finishChallenge() {
    console.log('Congratulations on finishing your challenge!');
    for (let i = 0; i < tasks.length; i++) {
        console.log(`${winners[i].winnerUsername} won the ${tasks[i].taskName} and earned ${challenge.totalRewardAmount*tasks[i].percentOfTotalRewards/100} ${challenge.totalRewardUnits}`);
        console.log(`The winning submission can be found at the following filepath: ${winners[i].filePath}`);
    }
}

prompt.start();
createUser();