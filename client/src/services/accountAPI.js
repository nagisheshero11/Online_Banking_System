// client/src/services/accountAPI.js

const API_BASE_URL = "http://localhost:6060/api/account";

function getToken() {
    return localStorage.getItem("token");
}

// ✅ Fetch account details
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

// ✅ Update transaction limit
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