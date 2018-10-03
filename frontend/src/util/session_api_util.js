import axios from "axios";
import { merge } from "lodash";

export const login = user => axios.post("api/session", { user });
export const logout = () => axios.delete("api/session");
export const signup = user => axios.post("api/users", { user });
export const fetchBalance = user => axios.get("api/users/" + user.uuid);
export const saveName = user => axios.put("api/users/" + user.uuid, { user });
export const sendJobCents = transaction => axios.post("api/transfers/", transaction);
export const fetchHistory = user => axios.get("api/transfers/" + user.uuid);
export const createChallenge = challenge => axios.post("api/challenges/", challenge);