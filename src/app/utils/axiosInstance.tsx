import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://93.93.117.239//api/v1",
  withCredentials: true,
});

export default axiosInstance;
