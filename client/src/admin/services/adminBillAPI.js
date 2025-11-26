import axios from "axios";

const API_URL = "http://localhost:6060/api/admin/bills";

/* ------------------------- TOKEN HELPER ------------------------- */
const getToken = () => localStorage.getItem("token");

/* ------------------------- CREATE BILL ------------------------- */
/*
  POST /api/admin/bills/create
  Body: { username, accountNumber, amount, dueDate, billType }
*/
export const createBill = async (billData) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "POST",
            url: `${API_URL}/create`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: billData,
        });

        return res.data;
    } catch (err) {
        console.error("❌ Create Bill Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to create bill");
    }
};
