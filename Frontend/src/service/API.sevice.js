import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(API(prom.originalRequest));
        }
    });
    
    failedQueue = [];
};



export default API;