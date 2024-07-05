import axiosInt from "./axiosUtil";

const callAPI = async (endpoint, params = {}, method, data = null, multipart) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const headers = multipart == true ? {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  } :  {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // example header
      };
      
  let response;
  switch (method.toLowerCase()) {
    case "get":
      response = await axiosInt.get(endpoint, { headers, params });
      break;
    case "post":
      response = await axiosInt.post(endpoint, data, { headers });
      break;
    case "put":
      response = await axiosInt.put(endpoint, data, { headers });
      break;
    case "delete":
      response = await axiosInt.delete(endpoint, { headers, params });
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
  return response?.data;
};

export const API = async (endpoint, params = {}, method, data = null) => {
  
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const multiPartHeader = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  const response = await axiosInt.post(endpoint, data, { multiPartHeader, params });

  return response?.data;
};

export default callAPI;
