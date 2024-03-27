import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://triploro.es/api/v1",
  withCredentials: true,
});

export default axiosInstance;
