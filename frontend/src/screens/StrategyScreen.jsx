// StrategyScreen.jsx
import React from 'react';
import Header from '../components/Header';

export default function StrategyScreen() {
    return (
        <div style={{ padding: '24px' }}>
            <Header title="📈 Strategy Analytics" subtitle="Compare setup performance across timeframes" />
            <p>This is the Strategy screen. You’ll view and analyze win rates, setups, and average RR here.</p>
        </div>
    );
}
