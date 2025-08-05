// StockList.jsx
import React, { useEffect, useState } from 'react';
import StockListCard from './StockListCard';
import { mockSetupScanner } from './mockSetupScanner';
import './StockList.css';

const StockList = ({ stocks, activeSymbol, onSelect, searchTerm }) => {
    const [scannedStock, setScannedStock] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (searchTerm && !stocks.find((s) => s.symbol === searchTerm)) {
            setIsLoading(true);
            mockSetupScanner(searchTerm).then((res) => {
                setScannedStock(res.found ? res.setup : { symbol: searchTerm, noSetup: true });
                setIsLoading(false);
            });
        } else {
            setScannedStock(null);
        }
    }, [searchTerm, stocks]);

    const visibleStocks = searchTerm
        ? [...stocks.filter((s) => s.symbol.includes(searchTerm)), ...(scannedStock ? [scannedStock] : [])]
        : stocks;

    return (
        <div className="stock-list">
            {isLoading && <div className="scan-loading">🔍 Scanning {searchTerm}...</div>}
            {visibleStocks.map((stock, index) => {
                const isActive = stock.symbol === activeSymbol;
                return (
                    <div key={index} onClick={() => onSelect(stock)}>
                        <StockListCard
                            stock={stock}
                            isActive={isActive}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default StockList;
