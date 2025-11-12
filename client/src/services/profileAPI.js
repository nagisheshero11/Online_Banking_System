
const API_BASE_URL = "http://localhost:6060/api/user";


// Helper: Get JWT token from localStorage
function getToken() {
    return localStorage.getItem("token");
}

//  Fetch logged-in user's profile details
//  * Endpoint: GET /api/user/profile
export async function fetchUserProfile() {
    const token = getToken();
    if (!token) throw new Error("No authentication token found");

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 401) {
            // Unauthorized — invalid token
            localStorage.removeItem("token");
            throw new Error("Session expired. Please log in again.");
        }

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Failed to fetch profile");
        }

        // Parse JSON response
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Profile Fetch Error:", error.message);
        throw error;
    }
}


//  Update user profile (PUT /api/user/update)
//  Only allows editable fields (e.g., firstName, lastName, phoneNumber)

export async function updateUserProfile(updatedData) {
    const token = getToken();
    if (!token) throw new Error("No authentication token found");

    try {
        const response = await fetch(`${API_BASE_URL}/profile/update`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Session expired. Please log in again.");
        }

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Failed to update profile");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Profile Update Error:", error.message);
        throw error;
    }
}



export async function getUserProfile() {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        return await response.json();
    } catch (error) {
        console.error("Profile fetch error:", error);
        throw error;
    }
}