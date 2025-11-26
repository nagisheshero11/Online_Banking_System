import React from "react";
import "./styles/BankFunds.css";

import { getBankFunds } from "./services/bankFundAPI";
import { FaLandmark, FaArrowUp, FaArrowDown, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BankFunds = () => {
    const [funds, setFunds] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchFunds();
    }, []);

    const fetchFunds = async () => {
        try {
            const data = await getBankFunds();
            setFunds(data.totalBalance);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currency = (n) => n?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || "₹0.00";

    return (
        <div className="bank-funds">
            <div className="fund-box">
                <FaLandmark className="fund-icon" />
                <h2>Total Bank Reserve</h2>
                <p className="fund-amount">{loading ? "Loading..." : currency(funds)}</p>
                <div className="fund-subtitle">Current available liquidity</div>

                <button className="history-btn" onClick={() => navigate('/admin/bank-funds/history')} style={{
                    marginTop: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem'
                }}>
                    <FaHistory /> View Transaction History
                </button>
            </div>

            <div className="fund-info-cards">
                <div className="info-card">
                    <div className="icon-box debit">
                        <FaArrowDown />
                    </div>
                    <div>
                        <h3>Loan Disbursals</h3>
                        <p>Funds decrease when loans are approved.</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="icon-box credit">
                        <FaArrowUp />
                    </div>
                    <div>
                        <h3>Repayments (EMI & Credit Card)</h3>
                        <p>Funds increase when EMIs or Credit Card bills are paid.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BankFunds;