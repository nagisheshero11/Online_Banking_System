import React, { useEffect, useState } from "react";
import { fetchMyBills, payBill } from "../../services/billsAPI";
import { FaExclamationCircle } from "react-icons/fa";
import "./styles/PayBills.css";

const currency = (n) =>
    n.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const PayBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        setLoading(true);
        try {
            const data = await fetchMyBills();
            setBills(data);
        } catch (err) {
            setError("Unable to fetch bills");
        }
        setLoading(false);
    };

    const handlePay = async (id) => {
        try {
            await payBill(id);
            alert("Bill paid successfully!");
            loadBills();
        } catch (err) {
            alert("Payment failed");
        }
    };

    return (
        <div className="pay-bills-page">

            <div className="page-header-wrapper">
                <div className="page-header">
                    <p className="header-subtitle">Manage and pay your pending bills</p>
                </div>
            </div>

            {loading && <p>Loading bills...</p>}
            {error && <p className="validation-message"><FaExclamationCircle /> {error}</p>}

            <div className="bill-selector-container">
                <div className="bill-selector-card card">
                    <h3 className="selector-title">Your Pending Bills</h3>

                    {bills.length === 0 && (
                        <p style={{ textAlign: "center", padding: "20px" }}>
                            🎉 You have no pending bills!
                        </p>
                    )}

                    {bills.length > 0 && bills.map((bill) => (
                        <div key={bill.id} className="bill-type-tile" style={{ marginBottom: "20px" }}>
                            <span className="tile-label">{bill.billType}</span>
                            <span className="summary-value">{currency(bill.amount)}</span>

                            <button
                                className="btn-pay"
                                style={{ marginTop: "10px", width: "100%" }}
                                onClick={() => handlePay(bill.id)}
                            >
                                Pay Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default PayBills;