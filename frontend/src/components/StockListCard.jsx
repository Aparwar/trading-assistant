import React from "react";

const emotionMeta = {
    Greed: { color: "#00c853", label: "Greed Setup" },
    Fear: { color: "#d50000", label: "Fear Reversal" },
    Trap: { color: "#ff9100", label: "Trap Signal" },
    Panic: { color: "#6a1b9a", label: "Panic Drop" },
    Exhaustion: { color: "#546e7a", label: "Exhaustion Phase" },
};

const StockListCard = ({ symbol, price, emotion, confidence }) => {
    const meta = emotionMeta[emotion] || {
        color: "#90a4ae",
        label: emotion,
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                borderRadius: "12px",
                padding: "10px 14px",
                marginBottom: "10px",
                fontFamily: "Inter, sans-serif",
                boxShadow: `-4px 0 0 0 ${meta.color}, 0 1px 2px rgba(0,0,0,0.05)`,
                border: "1px solid #e0e0e0",
            }}
        >
            {/* Symbol + Price */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <div style={{ fontWeight: 700, fontSize: "14.5px", color: "#212121" }}>{symbol}</div>
                <div style={{ fontSize: "13px", color: "#424242" }}>₹{price}</div>
            </div>

            {/* Emotion + Confidence */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                    style={{
                        fontSize: "11.5px",
                        fontWeight: 400,
                        color: meta.color,
                    }}
                >
                    {meta.label}
                </div>
                <div style={{ fontSize: "11.5px", color: "#555" }}>
                    {Math.round(confidence * 100)}% Confidence
                </div>
            </div>
        </div>
    );
};

export default StockListCard;
