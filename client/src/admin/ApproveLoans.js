import React from "react";
import "./styles/ApproveLoans.css";

const mockLoans = [
    { id: 1, name: "Suresh Kumar", amount: 500000, date: "Nov 10, 2025" },
    { id: 2, name: "Priya Singh", amount: 200000, date: "Nov 11, 2025" },
];

const ApproveLoans = () => {
    return (
        <div className="approve-loans">
            <h1>Approve Loan Applications</h1>

            {mockLoans.map((loan) => (
                <div className="loan-req-box" key={loan.id}>
                    <div>
                        <h3>{loan.name}</h3>
                        <p>Amount: ₹{loan.amount.toLocaleString()}</p>
                        <small>Applied on: {loan.date}</small>
                    </div>
                    <button className="approve-btn">Approve</button>
                </div>
            ))}
        </div>
    );
};

export default ApproveLoans;