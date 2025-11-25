import axios from "axios";

const API_URL = "http://localhost:6060/api/admin/bank-funds";

/* ------------------------- TOKEN HELPER ------------------------- */
const getToken = () => localStorage.getItem("token");

/* ------------------------- GET BANK FUNDS ----------------------- */
/*
  GET /api/admin/bank-funds
*/
export const getBankFunds = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "GET",
            url: API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Get Bank Funds Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to fetch bank funds");
    }
};

/* ------------------------- GET HISTORY -------------------------- */
/*
  GET /api/admin/bank-funds/history
*/
export const getBankFundHistory = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "GET",
            url: `${API_URL}/history`,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Get History Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to fetch history");
    }
};
