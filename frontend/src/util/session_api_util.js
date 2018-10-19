import axios from "axios";
import { merge } from "lodash";

export const login = user => axios.post("api/session", { user });
export const logout = () => axios.delete("api/session");
export const signup = user => axios.post("api/users", { user });
export const fetchUser = user => axios.get("api/users/" + user.uuid);
export const shareChallenge = (challengeUuid, fromAddress, toAddress) => axios.patch(`api/challenges/${challengeUuid}`, {fromAddress, toAddress});
export const createChallenge = challenge => axios.post("api/challenges/", challenge);
export const redeemChallenge = (challengeUuid, sponsorAddress) => axios.post(`api/challenges/${challengeUuid}/${sponsorAddress}`);