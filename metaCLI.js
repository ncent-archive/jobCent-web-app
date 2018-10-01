'use strict';

const prompt = require('prompt');
const axios = require('axios');
const fs = require('fs');

const testNet = 'http://localhost:8000/api';

let userUuid;
let challengeUuid;
let challenge;
const tasks = [];
const winners = [];
let tokenAmount;

function readJson (path, callback) {
    fs.readFile(require.resolve(path), (err, data) => {
        console.log(data);
        if (err) {
            console.log(err.message);
            return {};
        } else {
            callback(JSON.parse(data));
        }
    });
}

function createUser () {
    console.log('Welcome to the jobCent! Please enter your information below:');
    prompt.get(['email', 'company'], function(err, result) {
        axios.post(testNet + '/users', {
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
    console.log(`Welcome, ${userData.data.emailAddress}!`);
    console.log(`The public key for your token wallet address is ${userData.data.walletAddressPublicKey}`);
    console.log('Would you like to submit a JSON file to create your jobCent program? Type "yes" if you would like to do so, otherwise you will be instructed to input the challenge parameters manually');
    prompt.get(['submitJSONFile'], function(err, result) {
        if (result.submitJSONFile === 'yes') {
            createChallengeFromJSON();
        } else {
            createChallengeFromInput();
        }
    })
}

function createChallengeFromInput () {
    console.log('Please input the parameters for the Challenge that you want to create with our app!');
    prompt.get(['challengeTitle', 'tokenAmount', 'description'], function(err, result) {
        tokenAmount = result.tokenAmount;
        axios.post(testNet + '/challenges', {
            challengeTitle: result.challengeTitle,
            challengeDescription: result.description,
            tokenAmount: result.tokenAmount,
            sponsorId: userUuid
        })
        .then(createTasksFromInput)
        .catch(function (error) {
            console.log(error.message);
        });
    });
}

function createTasksFromInput (challengeData) {
    challengeUuid = challengeData.data.uuid;
    challenge = challengeData.data;
    console.log(`Your challenge has been successfully created with ${tokenAmount} ${challenge.challengeTitle} tokens!`);
    console.log(`For your reference, the UUID for your new stamped token is ${challenge.tokenTypeUuid}`);
    console.log("How many tasks will your challenge require?");
    prompt.get(['numberOfTasks'], function (err, result) {
        createTaskFromInput(1, result.numberOfTasks);
    });
}

function createTaskFromInput (currentTaskNumber, totalNumTasks) {
    if (currentTaskNumber > totalNumTasks) {
        console.log('Finished creating tasks');
        executeChallenge();
    } else {
        console.log(`Let's define task ${currentTaskNumber} of ${totalNumTasks}`);
        console.log('Please enter the task parameters below:');
        prompt.get(['taskName', 'requirements', 'redemptionAmount'], function (err, result) {
            axios.post(testNet + '/tasks', {
                taskName: result.taskName,
                requirements: result.requirements,
                redemptionAmount: result.redemptionAmount,
                challengeUuid: challengeUuid
            })
            .then(function (taskData) {
                tasks.push(taskData.data);
                createTaskFromInput(currentTaskNumber + 1, totalNumTasks);
            })
            .catch(function (error) {
                console.log(error.message);
            });
        })
    }
}

function createChallengeFromJSON () {
    console.log('Please input the full file path to your JSON file.');
    prompt.get(['jsonFilePath'], function(err, result) {
        readJson(result.jsonFilePath, function (challengeJson) {
            axios.post(testNet + '/challenges', {
                challengeTitle: challengeJson.challenge.challengeTitle,
                challengeDescription: challengeJson.challenge.description,
                tokenAmount: challengeJson.challenge.tokenAmount,
                sponsorId: userUuid
            })
            .then(function (challengeData) {
                console.log("Your challenge has been successfully created!");
                challengeUuid = challengeData.data.uuid;
                challenge = challengeData.data;
                createTaskFromJson(1, challengeJson.tasks.length, challengeJson.tasks);
            })
            .catch(function (error) {
                console.log(error.message);
            });
        });
    })
}

function createTaskFromJson (currentTaskNumber, totalNumTasks, tasksJson) {
    if (currentTaskNumber > totalNumTasks) {
        console.log('Finished creating tasks');
        executeChallenge();
    } else {
        const currentTask = tasksJson[currentTaskNumber - 1];
        axios.post(testNet + '/tasks', {
            taskName: currentTask.taskName,
            requirements: currentTask.requirements,
            redemptionAmount: currentTask.redemptionAmount,
            challengeUuid: challengeUuid
        })
        .then(function (taskData) {
            tasks.push(taskData.data);
            createTaskFromInput(currentTaskNumber + 1, totalNumTasks);
        })
        .catch(function (error) {
            console.log(error.message);
        });
    }
}

function executeChallenge () {
    console.log('Now starting your challenge');
    executeTask(1);
}

function executeTask (currentTaskNumber) {
    if (currentTaskNumber > tasks.length) {
        finishChallenge();
    } else {
        console.log(`Please collect submissions for ${tasks[currentTaskNumber - 1].taskName}`);
        console.log(`Please enter the the information about the winner when you are ready:`);
        prompt.get(['winnerUsername', 'filePath'], function (err, result) {
            winners.push({
                winnerUsername: result.winnerUsername,
                filePath: result.filePath
            });
            executeTask(currentTaskNumber + 1);
        })
    }
}

function finishChallenge () {
    console.log('Congratulations on finishing your challenge!');
    for (let i = 0; i < tasks.length; i++) {
        console.log(`${winners[i].winnerUsername} won the ${tasks[i].taskName} and earned $${tasks[i].redemptionAmount}!`);
        console.log(`The winning resume can be found at the following filepath: ${winners[i].filePath}`);
    }
}

prompt.start();
createUser();