// client/src/services/accountAPI.js

const API_BASE_URL = "http://localhost:6060/api/account";

/**
 * Helper to get JWT token
 */
function getToken() {
    return localStorage.getItem("token");
}

/**
 * ✅ Fetch current user's account details
 * GET /api/account/me
 */
export async function getAccountDetails() {
    const token = getToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(`${API_BASE_URL}/me`, {
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
 * ✅ Update transaction limit
 * PUT /api/account/limit
 * Body: { newLimit: number }
 */
export async function updateTransactionLimit(newLimit) {
    const token = getToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(`${API_BASE_URL}/limit`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newLimit }),
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.text();
}

/**
 * ✅ Perform a money transfer
 * POST /api/account/transfer
 * Body: { toAccountNumber, amount, remarks }
 */
export async function transferMoney(transferData) {
    const token = getToken();
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(`${API_BASE_URL}/transfer`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
    });

    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}
