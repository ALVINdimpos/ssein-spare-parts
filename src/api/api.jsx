import axios from "axios";
import { parseJwt } from "../utils";
import { lsUser } from "../constants";

/**************************
 * Axios - App Base API URL
 **************************/
const { VITE_APP_BASE_API_URL } = import.meta.env;

const API = axios.create({
  baseURL: VITE_APP_BASE_API_URL,
});

/*****************************************
 * Verification of token and pass it if
 * valid and logout user if token expired
 *****************************************/
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem(lsUser));
  const token = user?.token;
  if (token) {
    const decodedJwt = parseJwt(token);
    // Check if session not expired
    if (decodedJwt?.exp * 1000 < Date.now()) {
      localStorage.removeItem(lsUser);
      window.location.href = "/login";
    } else {
      req.headers.Authorization = token;
    }
  }
  return req;
});
// eslint-disable-next-line react-refresh/only-export-components
export default API;
