// client/src/services/transactionAPI.js

const API_BASE_URL = "http://localhost:6060/api/account/transactions";

/**
 * Helper — Get JWT token
 */
function getToken() {
    return localStorage.getItem("token");
}

/**
 * ✅ Fetch all transactions of the logged-in user
 * Endpoint: GET /api/account/transactions
 */
export async function getAllTransactions() {
    const token = getToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

/**
 * ✅ (Optional) Fetch paginated transactions
 * Example usage (if backend supports pagination):
 * GET /api/account/transactions?page=0&size=10
 */
export async function getPaginatedTransactions(page = 0, size = 10) {
    const token = getToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

/**
 * ✅ (Optional) Filter by date range
 * Example usage:
 * GET /api/account/transactions?startDate=2025-11-01&endDate=2025-11-13
 */
export async function getTransactionsByDateRange(startDate, endDate) {
    const token = getToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(
        `${API_BASE_URL}?startDate=${startDate}&endDate=${endDate}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

/**
 * ✅ (Optional) Download as CSV or PDF
 * Backend can respond with a file stream later
 */
export async function downloadTransactionStatement() {
    const token = getToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(`${API_BASE_URL}/download`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.blob();
}
