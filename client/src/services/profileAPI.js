import axios from "axios";

const API_BASE_URL = "/api/user";


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

//  Fetch logged-in user's profile details
//  * Endpoint: GET /api/user/profile
export async function fetchUserProfile() {
    try {
        const { data } = await api.get("/profile");
        return data;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Session expired. Please log in again.");
        }
        const msg = error.response?.data || error.message || "Failed to fetch profile";
        console.error("Profile Fetch Error:", msg);
        throw new Error(msg);
    }
}


//  Update user profile (PUT /api/user/update)
//  Only allows editable fields (e.g., firstName, lastName, phoneNumber)

export async function updateUserProfile(updatedData) {
    try {
        const { data } = await api.put("/profile/update", updatedData, {
            headers: { "Content-Type": "application/json" },
        });
        return data;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Session expired. Please log in again.");
        }
        const msg = error.response?.data || error.message || "Failed to update profile";
        console.error("Profile Update Error:", msg);
        throw new Error(msg);
    }
}



export async function getUserProfile() {
    try {
        const { data } = await api.get("/profile");
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Failed to fetch profile";
        console.error("Profile fetch error:", msg);
        throw new Error(msg);
    }
}

// Change Password (POST /api/user/profile/change-password)
export async function changePassword(oldPassword, newPassword) {
    try {
        const { data } = await api.post("/profile/change-password", {
            oldPassword,
            newPassword
        }, {
            headers: { "Content-Type": "application/json" },
        });
        return data;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Session expired. Please log in again.");
        }
        const msg = error.response?.data || error.message || "Failed to change password";
        throw new Error(msg);
    }
}