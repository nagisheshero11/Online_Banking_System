const API_BASE = "http://localhost:6060/api/bills";

const getToken = () => localStorage.getItem("token");

export const fetchMyBills = async () => {
    const res = await fetch(`${API_BASE}/my`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) throw new Error("Failed to fetch bills");
    return res.json();
};

export const payBill = async (billId) => {
    const res = await fetch(`${API_BASE}/pay/${billId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) throw new Error("Payment failed");
    return res.text();
};