import React from "react";
import "./EmotionInsightPanel.css";

const EmotionInsightPanel = ({ data }) => {
    if (!data) return null;

    const {
        emotion,
        reason,
        smart_money,
        retailers,
        entry,
        exit,
        confidence,
        takeaway,
        tla,
        levels,
    } = data;

    return (
        <div className="insight-canvas-panel compact">
            {/* ===== EMOTION SNAPSHOT ===== */}
            <div className="section">
                <div className="section-heading emotion-heading">
                    🧠 {emotion.toUpperCase()}
                </div>
                <div className="emotion-metrics">
                    <div><strong>Entry:</strong> ₹{entry.price} <span className={`dir ${entry.direction.toLowerCase()}`}>{entry.direction.toUpperCase()}</span></div>
                    <div><strong>Stoploss:</strong> ₹{exit.stopLoss}</div>
                    <div><strong>Target:</strong> ₹{exit.target}</div>
                    <div><strong>Confidence:</strong> {confidence}%</div>
                </div>
            </div>

            {/* ===== REASON ===== */}
            <div className="section">
                <div className="section-heading">📌 Reason</div>
                <div className="section-body">{reason}</div>
            </div>

            {/* ===== SMART MONEY / RETAIL ===== */}
            <div className="section row">
                <div className="column">
                    <div className="section-heading">💰 Smart Money</div>
                    <div className="section-body">{smart_money}</div>
                </div>
                <div className="column">
                    <div className="section-heading">🧍 Retail Traders</div>
                    <div className="section-body">{retailers}</div>
                </div>
            </div>

            {/* ===== TLA BREAKDOWN ===== */}
            <div className="section">
                <div className="section-heading">📊 TLA Context</div>
                <div className="section-body">
                    <div><strong>Trend:</strong> {tla.trend}</div>
                    <div><strong>Location:</strong> ₹{tla.currentPrice} | High: ₹{tla.swingHigh} | Low: ₹{tla.swingLow}</div>
                    <div><strong>Action:</strong> {tla.action}</div>
                </div>
            </div>

            {/* ===== SUPPORT / RESISTANCE GRID ===== */}
            <div className="section">
                <div className="section-heading">📐 Support & Resistance</div>
                <div className="sr-grid">
                    {Object.entries(levels).map(([tf, val]) => (
                        <div key={tf} className="sr-row">
                            <span>{tf}</span>
                            <span>S ₹{val.support}</span>
                            <span>R ₹{val.resistance}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== TAKEAWAY ===== */}
            <div className="section takeaway">
                <div className="section-heading">🧠 Takeaway</div>
                <div className="section-body">{takeaway}</div>
            </div>
        </div>
    );
};

export default EmotionInsightPanel;
