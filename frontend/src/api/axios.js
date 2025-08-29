import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:5050/api",
    withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const tokenExpiry = localStorage.getItem("tokenExpiry");
        
        // Check if token is expired before making request
        if (token && tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
            // Token is expired, clear it
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("tokenExpiry");
            window.location.href = "/login";
            return Promise.reject(new Error("Token expired"));
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired according to backend
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("tokenExpiry");
            
            // Only redirect if not already on login page to avoid infinite loops
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
