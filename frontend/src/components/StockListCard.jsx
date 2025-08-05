// StockListCard.jsx
import React from "react";
import "./StockListCard.css";

const emotionMeta = {
    Greed: { color: "#00c853", label: "Greed Setup" },
    Fear: { color: "#d50000", label: "Fear Reversal" },
    Trap: { color: "#ff9100", label: "Trap Signal" },
    Panic: { color: "#6a1b9a", label: "Panic Drop" },
    Exhaustion: { color: "#546e7a", label: "Exhaustion Phase" },
};

const StockListCard = ({ stock, isActive, onSelect }) => {
    const { symbol, price, emotion, confidence } = stock;
    const meta = emotionMeta[emotion] || {
        color: "#90a4ae",
        label: emotion,
    };

    const cardClass = `stock-card ${isActive ? 'active-stock' : ''}`;

    return (
        <div onClick={() => onSelect(stock)} className={cardClass} style={{ boxShadow: `-4px 0 0 0 ${meta.color}, 0 1px 2px rgba(0,0,0,0.05)` }}>
            {/* Symbol + Price */}
            <div className="stock-card-header">
                <div className="stock-symbol">{symbol}</div>
                <div className="stock-price">₹{price}</div>
            </div>

            {/* Emotion + Confidence */}
            <div className="stock-card-footer">
                <div className="emotion-label" style={{ color: meta.color }}>
                    {meta.label}
                </div>
                <div className="confidence">
                    {Math.round(confidence * 100)}% Confidence
                </div>
            </div>
        </div>
    );
};

export default StockListCard;
