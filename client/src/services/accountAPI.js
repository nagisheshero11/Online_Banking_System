// client/src/services/accountAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:6060/api/account";

/**
 * Helper to get JWT token
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
 * ✅ Fetch current user's account details
 * GET /api/account/me
 */
export async function getAccountDetails() {
    try {
        const { data } = await api.get("/me");
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Failed to fetch account";
        throw new Error(msg);
    }
}

/**
 * ✅ Update transaction limit
 * PUT /api/account/limit
 * Body: { newLimit: number }
 */
export async function updateTransactionLimit(newLimit) {
    try {
        const { data } = await api.put("/limit", { newLimit }, {
            headers: { "Content-Type": "application/json" },
        });
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Failed to update limit";
        throw new Error(msg);
    }
}

/**
 * ✅ Perform a money transfer
 * POST /api/account/transfer
 * Body: { toAccountNumber, amount, remarks }
 */
export async function transferMoney(transferData) {
    try {
        const { data } = await api.post("/transfer", transferData, {
            headers: { "Content-Type": "application/json" },
        });
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Transfer failed";
        throw new Error(msg);
    }
}
/**
 * ✅ Verify Account Number
 * GET /api/account/verify/{accountNumber}
 */
export async function verifyAccount(accountNumber) {
    try {
        const { data } = await api.get(`/verify/${accountNumber}`);
        return data;
    } catch (error) {
        // If 404 or other error, return valid: false
        return { valid: false };
    }
}
