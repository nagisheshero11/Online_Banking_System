import axios from "axios";

const API_BASE = "http://localhost:6060/api/bills";

const getToken = () => localStorage.getItem("token");

const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchMyBills = async () => {
    try {
        const { data } = await api.get("/my");
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Failed to fetch bills";
        throw new Error(msg);
    }
};

export const payBill = async (billId) => {
    try {
        const { data } = await api.post(`/pay/${billId}`);
        return data;
    } catch (error) {
        const msg = error.response?.data || error.message || "Payment failed";
        throw new Error(msg);
    }
};