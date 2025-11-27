// client/src/services/adminLoanAPI.js

import axios from "axios";

const API_URL = "/api/admin/loans";
const getToken = () => localStorage.getItem("token");

/* ---------------------------------------------------------
   GET ALL LOANS (ADMIN)
--------------------------------------------------------- */
export const getAllLoans = async () => {
    const token = getToken();
    const res = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

/* ---------------------------------------------------------
   APPROVE LOAN
--------------------------------------------------------- */
export const approveLoan = async (loanId) => {
    const token = getToken();
    const res = await axios.post(
        `${API_URL}/approve/${loanId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

/* ---------------------------------------------------------
   REJECT LOAN
--------------------------------------------------------- */
export const rejectLoan = async (loanId) => {
    const token = getToken();
    const res = await axios.post(
        `${API_URL}/reject/${loanId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

/* ---------------------------------------------------------
   GET LOAN STATS
--------------------------------------------------------- */
export const getLoanStats = async () => {
    const token = getToken();
    const res = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

/* ---------------------------------------------------------
   GET LOAN HISTORY
--------------------------------------------------------- */
export const getLoanHistory = async () => {
    const token = getToken();
    const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};