import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://14.225.205.103:8080",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
})

axiosClient.defaults.withCredentials = true

// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return error;
  });

// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response);
    return response.data;
  }, function (err) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // console.log(err.response);
    const statusCode = err.response?.status;

    // we can handle global errors here
    switch (statusCode) {
      // authentication (token related issues)
      case 401: {
        // console.log("check");
        localStorage.clear();
        window.location.replace("/login")
        return err.response.data
      }

      // forbidden (permission related issues)
      case 403: {
        return err.response.data
      }

      // bad request
      case 400: {
        return err.response.data
      }

      // not found
      case 404: {
        // window.location.replace("/error/404")
        return err.response.data
      }

      // conflict
      case 409: {
        return err.response.data
      }

      // unprocessable
      case 422: {
        return err.response.data
      }

      case 500: {
        // window.location.replace("/error/500")
        return err.response.data
      }

      // generic api error (server related) unexpected
      default: {
        return Promise.reject(err);
      }
    }
  });

export default axiosClient