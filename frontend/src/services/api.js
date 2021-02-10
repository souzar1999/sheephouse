import axios from "axios";

import history from "../history";

import LocalStorage from "./localStorage.js";
const localStorageJs = LocalStorage.getService();

require("dotenv").config();

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

api.interceptors.request.use((config) => {
  const token = localStorageJs.getAccessToken();

  document.body.classList.add("loading-indicator");

  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    document.body.classList.remove("loading-indicator");
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    document.body.classList.remove("loading-indicator");

    if (
      error.response.status === 401 &&
      originalRequest.url === `${process.env.REACT_APP_API_URL}/refresh`
    ) {
      localStorageJs.clearToken();
      history.push("/logout/e");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorageJs.getRefreshToken();
      api
        .post("/refresh", {
          refreshToken,
        })
        .then((res) => {
          if (res.status === 201) {
            localStorageJs.setToken(res.data);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + res.data.token;
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default api;
