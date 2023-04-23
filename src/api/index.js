import axios from "axios";

export const api = axios.create();

api.interceptors.request.use((config) => {
  config.headers.Authorization = `${localStorage.getItem("token")}`;
  return config;
});