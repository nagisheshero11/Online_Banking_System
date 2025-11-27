import axios from "axios";

const API_URL = "/api/bills";

/* ------------------------- TOKEN HELPER ------------------------- */
const getToken = () => localStorage.getItem("token");

/* ------------------------- GET USER BILLS ------------------------ */
/*
  GET /api/bills/my
*/
export const getMyBills = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "GET",
            url: `${API_URL}/my`,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Get Bills Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to fetch bills");
    }
};

/* ------------------------- PAY A BILL --------------------------- */
/*
  POST /api/bills/pay/{id}
*/
export const payBill = async (billId) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "POST",
            url: `${API_URL}/pay/${billId}`,   // ✔ backend match
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Pay Bill Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to pay bill");
    }
};

/* ------------------------- GET BILLS BY LOAN --------------------- */
/*
  GET /api/bills/loan/{loanId}
*/
export const getBillsByLoan = async (loanId) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "GET",
            url: `${API_URL}/loan/${loanId}`,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Get Bills by Loan Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to fetch loan bills");
    }
};

/* ------------------------- PAY BILL WITH CARD ------------------- */
/*
  POST /api/bills/pay/card
  Body: { billId, cardId, pin }
*/
export const payBillWithCard = async (billId, cardId, pin) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    try {
        const res = await axios({
            method: "POST",
            url: `${API_URL}/pay/card`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: { billId, cardId, pin },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Pay Bill With Card Error:", err?.response || err);
        throw new Error(err?.response?.data || "Failed to pay bill with card");
    }
};