import api from "../../services/api";

const API_URL = "/admin/transactions";

/* ------------------------- GET ALL TRANSACTIONS ----------------- */
/*
  GET /api/admin/transactions/all
*/
export const getAllTransactions = async () => {
    try {
        const res = await api.get(`${API_URL}/all`);
        return res.data;
    } catch (err) {
        console.error("❌ Get Transactions Error:", err?.response || err);
        throw err;
    }
};
