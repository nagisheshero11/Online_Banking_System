
const API_BASE_URL = "http://localhost:6060/api/user";

// --------------------------------------------------
// Helper: Get JWT token from localStorage
// --------------------------------------------------
function getToken() {
    return localStorage.getItem("token");
}

// --------------------------------------------------
// Signup API (Public)
// --------------------------------------------------
export async function signup(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Signup failed");
        }

        return await response.text(); // "User registered successfully"
    } catch (error) {
        console.error("Signup Error:", error.message);
        throw error;
    }
}

// --------------------------------------------------
// Login API (Public)
// --------------------------------------------------
export async function login(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token); // store JWT token
        return data; // returns { token, username, email, role }
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
}

// --------------------------------------------------
// Token Verification API (Private)
// Verifies if stored token is still valid by calling a protected endpoint
// --------------------------------------------------
export async function verifyToken() {
    const token = getToken();
    if (!token) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            return true; // token valid
        } else {
            localStorage.removeItem("token"); // clear invalid token
            return false;
        }
    } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        return false;
    }
}

// --------------------------------------------------
// Logout (local only)
// --------------------------------------------------
export function logout() {
    localStorage.removeItem("token");
}