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

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
       

    
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // 1. Lowercase path check to prevent casing bugs (/signIn vs /signin)
        const currentPath = window.location.pathname.toLowerCase();
        const isSignInPage = currentPath === '/signin' || currentPath === '/signin/';
         
        // 2. Safely check if the request URL points to the refresh endpoint
        const requestUrl = originalRequest.url || '';
        const isRefreshRequest = requestUrl.includes('/user/refresh');
        
        // 3. FIX: Safely extract the status code from error.response
        const statusCode = error.response ? error.response.status : null;
        if (
            statusCode === 401 && 
            originalRequest &&
            !isRefreshRequest && 
            isSignInPage
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, originalRequest });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                axios.post(`${import.meta.env.VITE_BASE_API}/user/refresh`, {}, { withCredentials: true })
                    .then(() => {
                        resolve(API(originalRequest));
                        processQueue(null);
                    })
                    .catch((refreshError) => {
                        processQueue(refreshError);
                        
                        // Double check we aren't looping out into a redirect loop
                        if (window.location.pathname.toLowerCase() !== '/signin') {
                            window.location.href = '/signIn'; 
                        }
                        
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