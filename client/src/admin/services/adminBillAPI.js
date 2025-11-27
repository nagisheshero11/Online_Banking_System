import api from "../../services/api";

const API_URL = "/admin/bills";

/* ------------------------- CREATE BILL ------------------------- */
/*
  POST /api/admin/bills/create
  Body: { username, accountNumber, amount, dueDate, billType }
*/
export const createBill = async (billData) => {
    try {
        const res = await api.post(`${API_URL}/create`, billData);
        return res.data;
    } catch (err) {
        console.error("❌ Create Bill Error:", err?.response || err);
        throw err;
    }
};
