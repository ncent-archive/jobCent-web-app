import axios from "axios";
import { merge } from "lodash";

export const login = user => axios.post("api/session", { user });
export const logout = () => axios.delete("api/session");
export const signup = user => axios.post("api/users", { user });
export const fetchUser = user => axios.get("api/users/" + user.uuid);
export const sendChallenge = transaction => axios.post("api/transfers/", transaction);
export const createChallenge = challenge => axios.post("api/challenges/", challenge);