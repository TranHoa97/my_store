import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://14.225.205.103:8080",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response);
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

export default axiosClient