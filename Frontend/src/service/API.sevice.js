
import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    withCredentials: true
});

let isRefreshing = false;
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                axios.post(`${import.meta.env.VITE_BASE_API}/user/refresh`, {}, { withCredentials: true })
                    .then(() => {
                        resolve(API(originalRequest));
                    })
                    .catch((refreshError) => {
                        window.location.href = '/signin';
                        reject(refreshError);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default API;