import React, { useEffect, useState } from "react";
import { getPendingApplications, approveCard, rejectCard } from "./services/adminCardAPI";
import "./styles/ApproveCards.css";

import { useToast } from '../context/ToastContext';

const ApproveCards = () => {
    const { showToast } = useToast();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null); // For confirmation modal

    const loadCards = async () => {
        setLoading(true);
        try {
            const data = await getPendingApplications();
            setCards(data);
        } catch (err) {
            console.error("Failed to load cards", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCards();
    }, []);

    const confirmApprove = (card) => {
        setSelectedCard(card);
    };

    const handleApprove = async () => {
        if (!selectedCard) return;
        setProcessingId(selectedCard.id);
        try {
            await approveCard(selectedCard.id);
            showToast("Card Approved Successfully!", 'success');
            await loadCards();
            setSelectedCard(null);
        } catch (err) {
            showToast("Failed to approve card", 'error');
        }
        setProcessingId(null);
    };

    const handleReject = async (cardId) => {
        if (!window.confirm("Reject this card application?")) return;
        setProcessingId(cardId);
        try {
            await rejectCard(cardId);
            showToast("Card Rejected", 'info');
            await loadCards();
        } catch (err) {
            showToast("Failed to reject card", 'error');
        }
        setProcessingId(null);
    };

    if (loading) return <div className="loading-state">Loading...</div>;

    return (
        <div className="admin-content-container">
            <div className="admin-header-section">
                <h1 className="admin-page-title">Approve Cards</h1>
                <p className="admin-page-subtitle">Review and process pending debit/credit card requests.</p>
            </div>

            {cards.length === 0 ? (
                <div className="empty-state">No pending card applications.</div>
            ) : (
                cards.map((c) => (
                    <div className="card-req-box" key={c.id}>
                        <div className="left">
                            <h3>{c.cardHolder}</h3>
                            <div className="card-details-grid">
                                <div><strong>Type:</strong> {c.cardType}</div>
                                <div><strong>Applied:</strong> {new Date(c.createdAt).toLocaleDateString()}</div>
                                <div><strong>User ID:</strong> {c.user?.id || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="actions">
                            <button
                                className="approve-btn"
                                onClick={() => confirmApprove(c)}
                                disabled={processingId === c.id}
                            >
                                Approve
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => handleReject(c.id)}
                                disabled={processingId === c.id}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Confirmation Modal */}
            {selectedCard && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Card Approval</h3>
                        <p>Are you sure you want to approve this card?</p>

                        <div className="modal-summary">
                            <div className="summary-row"><span>Applicant:</span> <strong>{selectedCard.cardHolder}</strong></div>
                            <div className="summary-row"><span>Card Type:</span> <strong>{selectedCard.cardType}</strong></div>
                            <div className="summary-row"><span>Card Number:</span> <strong>{selectedCard.cardNumber}</strong></div>
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setSelectedCard(null)}>Cancel</button>
                            <button className="confirm-btn" onClick={handleApprove} disabled={processingId === selectedCard.id}>
                                {processingId === selectedCard.id ? "Processing..." : "Confirm Approval"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproveCards;