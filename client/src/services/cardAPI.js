import axios from 'axios';

const API_URL = 'http://localhost:6060/api/cards';

const getToken = () => localStorage.getItem('token');

export const getMyCards = async () => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.get(`${API_URL}/my`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const applyForCard = async (cardType) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_URL}/apply`, { cardType }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const blockCard = async (cardId) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_URL}/${cardId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const unblockCard = async (cardId) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_URL}/${cardId}/unblock`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const setCardPin = async (cardId, pin) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_URL}/${cardId}/set-pin`, { pin }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const simulateTransaction = async (cardId, amount) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_URL}/${cardId}/transaction`, { amount }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const generateBill = async (cardId) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_URL}/${cardId}/bill`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const sendCardPayment = async (paymentData) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    const res = await axios.post(`http://localhost:6060/api/card-payment/send`, paymentData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
