import api from "./api";

const API_URL = "/cards";

export const getMyCards = async () => {
    const res = await api.get(`${API_URL}/my`);
    return res.data;
};

export const applyForCard = async (cardType) => {
    const res = await api.post(`${API_URL}/apply`, { cardType });
    return res.data;
};

export const blockCard = async (cardId) => {
    const res = await api.post(`${API_URL}/${cardId}/block`);
    return res.data;
};

export const unblockCard = async (cardId) => {
    const res = await api.post(`${API_URL}/${cardId}/unblock`);
    return res.data;
};

export const setCardPin = async (cardId, pin) => {
    const res = await api.post(`${API_URL}/${cardId}/set-pin`, { pin });
    return res.data;
};

export const simulateTransaction = async (cardId, amount) => {
    const res = await api.post(`${API_URL}/${cardId}/transaction`, { amount });
    return res.data;
};

export const generateBill = async (cardId) => {
    const res = await api.post(`${API_URL}/${cardId}/bill`);
    return res.data;
};

export const sendCardPayment = async (paymentData) => {
    const res = await api.post(`/api/card-payment/send`, paymentData);
    return res.data;
};
