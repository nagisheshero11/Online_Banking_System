import axios from "axios";

// Relative path for K8s deployment (Nginx proxies /api -> Backend)
const API_BASE_URL = "/api";

/* -------------------------
   Token helper
------------------------- */
export const getToken = () => localStorage.getItem("token");

/* -------------------------
   Axios instance (with Authorization header)
------------------------- */
const api = axios.create({ baseURL: API_BASE_URL });

// Request interceptor to add Authorization header
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle session expiration
api.interceptors.response.use(
    (response) => response, // Simply return successful responses
    (error) => {
        // If response is 401 or 403, session has expired
        if (error.response && [401, 403].includes(error.response.status)) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            // Redirect to login page with session expired flag
            window.location.href = "/login?sessionExpired=true";
        }
        return Promise.reject(error); // Reject the promise to propagate the error
    }
);

export default api;
