// client/src/services/authAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:6060/api/user";

/* -------------------------
   Token helper
------------------------- */
export const getToken = () => localStorage.getItem("token");

/* -------------------------
   Axios instance (with Authorization header)
------------------------- */
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* -------------------------
   SIGNUP (Public)
   POST /api/user/signup
------------------------- */
export async function signup(userData) {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/signup`,
            userData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return data;
    } catch (error) {
        let msg = "Signup failed";
        if (error.response) {
            if (typeof error.response.data === 'string') {
                msg = error.response.data;
            } else if (error.response.data?.message) {
                msg = error.response.data.message;
            } else if (error.response.data?.error) {
                msg = error.response.data.error;
            }
        } else if (error.message) {
            msg = error.message;
        }
        throw new Error(msg);
    }
}

/* -------------------------
   LOGIN (Public)
   POST /api/user/login
------------------------- */
export async function login(credentials) {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/login`,
            credentials,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!data?.token) throw new Error("Invalid login response");

        // Store token + role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", (data.role || "USER").toUpperCase());

        return data; // {token, username, email, role}
    } catch (error) {
        let msg = "Login failed";
        if (error.response) {
            if (typeof error.response.data === 'string') {
                msg = error.response.data;
            } else if (error.response.data?.message) {
                msg = error.response.data.message;
            } else if (error.response.data?.error) {
                msg = error.response.data.error;
            } else {
                msg = error.response.statusText || "Login failed";
            }
        } else if (error.message) {
            msg = error.message;
        }
        console.error("Login Error:", msg);
        throw new Error(msg);
    }
}

/* -------------------------
   Verify Token (Private)
   GET /api/user/profile
------------------------- */
export async function verifyToken() {
    const token = getToken();
    if (!token) return false;

    try {
        await api.get("/profile");
        return true;
    } catch (error) {
        if ([401, 403].includes(error.response?.status)) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        }
        return false;
    }
}

/* -------------------------
   Logout
------------------------- */
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
}

/* -------------------------
   Role Getter
------------------------- */
export function getRole() {
    return localStorage.getItem("role") || null;
}