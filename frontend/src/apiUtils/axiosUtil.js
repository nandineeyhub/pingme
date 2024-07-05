import { baseURL } from "../apiConfig";
import axios from "axios"

const axiosInt = axios.create({
     baseURL:baseURL
})

axiosInt.interceptors.response.use(
    function (response) {
      // Do something with the response data
      return response;
    },
    function (error) {
      // Log the error
      console.error('Request failed:', error);
      
      // Pass the error along
      return Promise.reject(error);
    }
  );

export default axiosInt