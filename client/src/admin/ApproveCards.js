import React from "react";
import "./styles/ApproveCards.css";

const mockCards = [
    { id: 1, name: "Rahul Sharma", cardType: "Credit Card", date: "Nov 13, 2025" },
    { id: 2, name: "Anita Rao", cardType: "Debit Card", date: "Nov 14, 2025" },
];

const ApproveCards = () => {
    return (
        <div className="approve-cards">
            <h1>Approve Applied Cards</h1>

            {mockCards.map((c) => (
                <div className="card-req-box" key={c.id}>
                    <div className="left">
                        <h3>{c.name}</h3>
                        <p>{c.cardType}</p>
                        <small>Applied on: {c.date}</small>
                    </div>
                    <button className="approve-btn">Approve</button>
                </div>
            ))}

        </div>
    );
};

export default ApproveCards;