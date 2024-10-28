import axios from 'axios';
export const hcx = axios.create({
    baseURL: process.env.REACT_APP_HCX_BASE_URL,
    timeout: 1000,
    headers : {
        "Authorization": `Bearer xyz`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin" : "*"
    }
  });