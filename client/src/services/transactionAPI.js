// client/src/services/transactionAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:6060/api/account";

/**
 * Helper — Get JWT token
 */
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
 * ✅ Fetch all transactions of the logged-in user
 * Endpoint: GET /api/account/transactions
 */
export async function getAllTransactions() {
    try {
        const { data } = await api.get("/transactions");
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Failed to fetch transactions";
        throw new Error(msg);
    }
}

/**
 * ✅ (Optional) Fetch paginated transactions
 * Example usage (if backend supports pagination):
 * GET /api/account/transactions?page=0&size=10
 */
export async function getPaginatedTransactions(page = 0, size = 10) {
    try {
        const { data } = await api.get(`/transactions`, { params: { page, size } });
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Failed to fetch transactions";
        throw new Error(msg);
    }
}

/**
 * ✅ (Optional) Filter by date range
 * Example usage:
 * GET /api/account/transactions?startDate=2025-11-01&endDate=2025-11-13
 */
export async function getTransactionsByDateRange(startDate, endDate) {
    try {
        const { data } = await api.get(`/transactions`, { params: { startDate, endDate } });
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Failed to fetch transactions";
        throw new Error(msg);
    }
}

/**
 * ✅ (Optional) Download as CSV or PDF
 * Backend can respond with a file stream later
 */
export async function downloadTransactionStatement() {
    try {
        const response = await api.get(`/transactions/download`, { responseType: "blob" });
        return response.data; // Blob
    } catch (error) {
        const msg = error.response?.data || error.message || "Failed to download statement";
        throw new Error(msg);
    }
}
