import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
  