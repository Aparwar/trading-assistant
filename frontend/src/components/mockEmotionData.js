const mockEmotionData = {
    emotion: "Trap",
    reason:
        "Retailers entered after a breakout candle with high volume, but price reversed immediately — classic bull trap.",
    smart_money: "Sold into strength near resistance, triggering stop hunts.",
    retailers: "Chased momentum near highs without confirmation.",
    entry: {
        price: 22015,
        direction: "Buy"
    },
    exit: {
        stopLoss: 21800,
        target: 22400
    },
    confidence: 84,
    takeaway:
        "Avoid entering on volume spikes near resistance without strong follow-through.",
    tla: {
        trend: "Uptrend with slowing momentum over last 6 candles",
        currentPrice: 22490,
        swingHigh: 22540,
        swingLow: 21980,
        action: "Watch for reversal confirmation before shorting — avoid early entry."
    },
    levels: {
        "15m": { support: 22400, resistance: 22530 },
        "1H": { support: 22320, resistance: 22580 },
        "1D": { support: 21980, resistance: 22620 }
    }
};

export default mockEmotionData;
