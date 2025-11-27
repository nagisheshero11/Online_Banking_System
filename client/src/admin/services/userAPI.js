import api from "../../services/api";

const API_URL = "/admin/users";

/* ------------------------- GET ALL USERS ------------------------ */
/*
  GET /api/admin/users/all?search={keyword}
*/
export const getAllUsers = async (keyword = "") => {
    try {
        const res = await api.get(`${API_URL}/all`, {
            params: { search: keyword },
        });
        return res.data;
    } catch (err) {
        console.error("❌ Get Users Error:", err?.response || err);
        throw err;
    }
};
