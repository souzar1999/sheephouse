import axios from "axios";

import history from "../history";

import LocalStorage from "./localStorage.js";

const localStorage = LocalStorage.getService();

const api = axios.create({
  baseURL: "http://127.0.0.1:3333"
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getAccessToken();

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.url === "http://127.0.0.1:3333/refresh"
    ) {
      localStorage.clearToken();
      history.push("/logout");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getRefreshToken();
      console.log("entrou");
      return api
        .post("/refresh", {
          refreshToken
        })
        .then(res => {
          if (res.status === 201) {
            localStorage.setToken(res.data);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + localStorage.getAccessToken();
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default api;
