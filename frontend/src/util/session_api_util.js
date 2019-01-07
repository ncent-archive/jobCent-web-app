import axios from "axios";
import {merge} from "lodash";

export const login = user => {
    console.log("login in session_api_util.js", user);
    return axios.post("api/session", {user});
};
export const logout = () => axios.delete("api/session");
export const sessionLogin = user => {
    console.log("sessionLogin in session_api_util.js");
    return axios.post("api/session/confirm", user);
};
export const signup = user => axios.post("api/users", {user});
export const fetchUser = user => {
    console.log("fetchUser in session_api_util.js", user);
    return axios.get("api/users/" + user.uuid);
};
export const shareChallenge = (challengeUuid, fromAddress, toAddress, numShares) => axios.patch(`api/challenges/${challengeUuid}`, {
    fromAddress,
    toAddress,
    numShares
});
export const createChallenge = challenge => axios.post("api/challenges/", challenge);
export const redeemChallenge = (challengeUuid, sponsorAddress, redeemerAddress) => axios.post(`api/challenges/${challengeUuid}/${sponsorAddress}`, {redeemerAddress});
export const retrieveChallengeUsers = challengeUuid => {
    console.log("retrieveChallengeUsers in session_api_util.js");
    return axios.get(`api/challenges/balances/${challengeUuid}`);
};
export const redeemReferralCode = (referralCode, recipientUuid) => axios.put(`api/challenges/referralCode/${referralCode}`, {recipientUuid});
export const getReferralCode = (userUuid, challengeUuid) => axios.get(`api/challengeUsers/${userUuid}/${challengeUuid}`);
export const setTokensPerReferral = (userUuid, challengeUuid, tokensPerReferral ) => axios.patch(`api/challengeUsers/${userUuid}/${challengeUuid}`, {tokensPerReferral});