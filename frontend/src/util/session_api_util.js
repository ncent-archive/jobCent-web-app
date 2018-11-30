import axios from "axios";
import {merge} from "lodash";

export const login = user => axios.post("api/session", {user});
export const logout = () => axios.delete("api/session");
export const signup = user => axios.post("api/users", {user});
export const fetchUser = user => axios.get("api/users/" + user.uuid);
export const shareChallenge = (challengeUuid, fromAddress, toAddress, numShares) => axios.patch(`api/challenges/${challengeUuid}`, {
    fromAddress,
    toAddress,
    numShares
});
export const createChallenge = challenge => axios.post("api/challenges/", challenge);
export const redeemChallenge = (challengeUuid, sponsorAddress, redeemerAddress) => axios.post(`api/challenges/${challengeUuid}/${sponsorAddress}`, {redeemerAddress});
export const retrieveChallengeUsers = challengeUuid => axios.get(`api/challenges/balances/${challengeUuid}`);
export const redeemReferralCode = (referralCode, recipientUuid) => axios.put(`api/challenges/referralCode/${referralCode}`, {recipientUuid});