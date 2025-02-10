import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const createApi = (path: string) => {
  return axios.create({
    baseURL: `${BASE_URL}/${path}`, 
    withCredentials: true, 
  });
};

export default createApi;
