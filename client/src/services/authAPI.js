import axios from "axios";

const API_BASE_URL = "http://localhost:6060/api/user";

// --------------------------------------------------
// Helper: Get JWT token from localStorage
// --------------------------------------------------
function getToken() {
    return localStorage.getItem("token");
}

// --------------------------------------------------
// Axios instance with auth header interceptor
// --------------------------------------------------
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --------------------------------------------------
// Signup API (Public)
// --------------------------------------------------
export async function signup(userData) {
    try {
        const { data } = await api.post("/signup", userData, {
            headers: { "Content-Type": "application/json" },
            transformResponse: [(d) => d], // allow plain text responses
        });
        return data; // e.g., "User registered successfully"
    } catch (error) {
        const msg = error.response?.data || error.message || "Signup failed";
        console.error("Signup Error:", msg);
        throw new Error(msg);
    }
}

// --------------------------------------------------
// Login API (Public)
// --------------------------------------------------
export async function login(credentials) {
    try {
        const { data } = await api.post("/login", credentials, {
            headers: { "Content-Type": "application/json" },
        });
        if (!data?.token) throw new Error("Invalid credentials");
        localStorage.setItem("token", data.token);
        return data; // { token, username, email, role }
    } catch (error) {
        const msg = error.response?.data || "Invalid credentials";
        console.error("Login Error:", msg);
        throw new Error(msg);
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
        await api.get("/profile");
        return true;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }
        return false;
    }
}

// --------------------------------------------------
// Logout (local only)
// --------------------------------------------------
export function logout() {
    localStorage.removeItem("token");
}