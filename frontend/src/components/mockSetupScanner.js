// mockSetupScanner.js

const mockSetups = {
    BEL: {
        symbol: "BEL",
        price: 1562.4,
        emotion: "Greed",
        confidence: 0.79,
        entry: 1550,
        stop: 1525,
        target: 1600,
    },
    SBIN: {
        symbol: "SBIN",
        price: 602.1,
        emotion: "Trap",
        confidence: 0.71,
        entry: 598,
        stop: 585,
        target: 620,
    },
};

export const mockSetupScanner = async (symbol) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (mockSetups[symbol]) {
                resolve({ found: true, setup: mockSetups[symbol] });
            } else {
                resolve({ found: false });
            }
        }, 700); // simulate network delay
    });
};
