import axios from "axios";

const API_BASE_URL = "http://localhost:6060/api/user/analytics";

// Helper: Get JWT token from localStorage
function getToken() {
    return localStorage.getItem("token");
}

// Axios instance with auth header interceptor
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Get monthly analytics for logged-in user
 */
export async function getUserMonthlyAnalytics() {
    try {
        const { data } = await api.get("/monthly");
        return data;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Session expired. Please log in again.");
        }
        const msg = error.response?.data || error.message || "Failed to fetch analytics";
        console.error("Analytics Fetch Error:", msg);
        throw new Error(msg);
    }
}
