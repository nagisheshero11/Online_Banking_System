import api from "../../services/api";

const API_URL = "/admin/bank-funds";

/* ------------------------- GET BANK FUNDS ----------------------- */
/*
  GET /api/admin/bank-funds
*/
export const getBankFunds = async () => {
    try {
        const res = await api.get(API_URL);
        return res.data;
    } catch (err) {
        console.error("❌ Get Bank Funds Error:", err?.response || err);
        throw err;
    }
};

/* ------------------------- GET HISTORY -------------------------- */
/*
  GET /api/admin/bank-funds/history
*/
export const getBankFundHistory = async () => {
    try {
        const res = await api.get(`${API_URL}/history`);
        return res.data;
    } catch (err) {
        console.error("❌ Get History Error:", err?.response || err);
        throw err;
    }
};
