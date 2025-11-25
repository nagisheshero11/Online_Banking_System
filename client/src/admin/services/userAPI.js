import axios from "axios";

const API_URL = "http://localhost:6060/api/admin/users";

/* ------------------------- TOKEN HELPER ------------------------- */
const getToken = () => localStorage.getItem("token");

/* ------------------------- GET ALL USERS ------------------------ */
/*
  GET /api/admin/users/all?search={keyword}
*/
export const getAllUsers = async (keyword = "") => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "GET",
            url: `${API_URL}/all`,
            params: { search: keyword },
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Get Users Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to fetch users");
    }
};
