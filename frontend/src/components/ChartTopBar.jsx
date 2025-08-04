// src/components/ChartTopBar.jsx
import React from 'react';
import './ChartTopBar.css';

export default function ChartTopBar({ selectedStock, selectedTimeframe, onTimeframeChange }) {
    const timeframes = ['1M', '1W', '1D', '1H', '15m', '5m'];

    const formatTimeframeDisplay = (tf) => {
        switch (tf) {
            case '1M': return '1 Month';
            case '1W': return '1 Week';
            case '1D': return '1 Day';
            case '1H': return '1 Hour';
            case '15m': return '15 min';
            case '5m': return '5 min';
            default: return tf;
        }
    };
    return (
        <div className="live-topbar">
            <div className="live-left">
                <span className="live-symbol">
                    {selectedStock?.symbol || 'TATASTEEL'}
                </span>
                <span className="live-divider">|</span>
                <span className="live-timeframe">
                    {formatTimeframeDisplay(selectedTimeframe)}
                </span>
            </div>

            <div className="live-controls">
                {timeframes.map((tf) => (
                    <button
                        key={tf}
                        className={`live-btn ${selectedTimeframe === tf ? 'active' : ''}`}
                        onClick={() => onTimeframeChange(tf)}
                    >
                        {tf}
                    </button>
                ))}
            </div>
        </div>
    );
}
