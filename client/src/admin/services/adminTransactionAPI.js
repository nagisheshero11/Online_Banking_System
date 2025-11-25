import axios from "axios";

const API_URL = "http://localhost:6060/api/admin/transactions";

/* ------------------------- TOKEN HELPER ------------------------- */
const getToken = () => localStorage.getItem("token");

/* ------------------------- GET ALL TRANSACTIONS ----------------- */
/*
  GET /api/admin/transactions/all
*/
export const getAllTransactions = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "GET",
            url: `${API_URL}/all`,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Get Transactions Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to fetch transactions");
    }
};
