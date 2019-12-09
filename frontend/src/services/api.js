import axios from "axios";

import { store } from "../store";

const api = axios.create({
  baseURL: "http://127.0.0.1:3333"
});

api.interceptors.request.use(async config => {
  const userToken = store.getState().userToken;
  const refreshToken = store.getState().refreshToken;

  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;

    api.get("/user", config).catch(error => {
      api.get(`/refresh`, { refreshToken }, config);
    });
  }

  return config;
});

export default api;
