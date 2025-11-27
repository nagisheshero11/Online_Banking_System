import axios from 'axios';

const API_URL = 'http://localhost:6060/api/admin/cards';

const getToken = () => localStorage.getItem('token');

export const getPendingApplications = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.get(`${API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const getCardHistory = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const approveCard = async (cardId) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_URL}/approve/${cardId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const rejectCard = async (cardId) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_URL}/reject/${cardId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
