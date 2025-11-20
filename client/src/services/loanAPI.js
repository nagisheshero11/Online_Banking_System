// client/src/services/loanAPI.js

import axios from "axios";

const API_URL = "http://localhost:6060/api/loans";

/* ------------------------- TOKEN HELPER ------------------------- */
const getToken = () => localStorage.getItem("token");

/* ------------------------- APPLY FOR LOAN ----------------------- */
export const applyForLoan = async (loanData) => {
    const token = getToken();

    if (!token) throw new Error("No token found");

    console.log("🚀 FRONTEND SENDING TOKEN:", token);

    try {
        const response = await axios({
            method: "POST",
            url: `${API_URL}/apply`,
            data: loanData,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        });

        return response.data;
    } catch (err) {
        console.error("❌ Loan Apply Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to apply loan");
    }
};

/* ------------------------- GET USER LOANS ----------------------- */
export const getMyLoans = async () => {
    const token = getToken();

    if (!token) throw new Error("No token found");

    try {
        const response = await axios({
            method: "GET",
            url: `${API_URL}/my`,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        });

        return response.data;
    } catch (err) {
        console.error("❌ Get Loans Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to fetch loans");
    }
};