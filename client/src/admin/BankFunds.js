import React from "react";
import "./styles/BankFunds.css";

const BankFunds = () => {
    const funds = 1788000;
    const deposits = 566000;
    const withdrawals = 330000;

    return (
        <div className="bank-funds">
            <h1>Bank Funds Overview</h1>

            <div className="fund-box">
                <h2>Total Funds</h2>
                <p>₹{funds.toLocaleString()}</p>
            </div>

            <div className="fund-breakdown">
                <div>
                    <h3>Total Deposits</h3>
                    <p>₹{deposits.toLocaleString()}</p>
                </div>
                <div>
                    <h3>Total Withdrawals</h3>
                    <p>₹{withdrawals.toLocaleString()}</p>
                </div>
            </div>

        </div>
    );
};

export default BankFunds;