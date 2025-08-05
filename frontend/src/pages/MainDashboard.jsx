import './MainDashboard.css';
import ChartPanel from '../components/ChartPanel';
import StockList from '../components/StockList';
import SearchBar from '../components/SearchBar';
import EmotionInsightPanel from '../components/EmotionInsightPanel';
import mockEmotionData from '../components/mockEmotionData';
import { MdBarChart } from 'react-icons/md';
import React, { useEffect, useState } from 'react';

const stockList = [
  { symbol: "RELIANCE", price: 2862, emotion: "Greed", confidence: 0.84 },
  { symbol: "TCS", price: 3540, emotion: "Trap", confidence: 0.69 },
  { symbol: "HDFCBANK", price: 1572, emotion: "Fear", confidence: 0.53 },
  { symbol: "INFY", price: 1398, emotion: "Exhaustion", confidence: 0.47 },
  { symbol: "SBIN", price: 622, emotion: "Greed", confidence: 0.77 },
  { symbol: "ITC", price: 446, emotion: "Panic", confidence: 0.61 },
  { symbol: "ICICIBANK", price: 970, emotion: "Fear", confidence: 0.58 },
  { symbol: "KOTAKBANK", price: 1744, emotion: "Trap", confidence: 0.66 },
  { symbol: "HCLTECH", price: 1370, emotion: "Greed", confidence: 0.81 },
  { symbol: "ULTRACEMCO", price: 9395, emotion: "Exhaustion", confidence: 0.49 },
];

export default function MainDashboard() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [viewedEmotion, setViewedEmotion] = useState(null); // When user clicks on overlay
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelectedStock(stockList[0]); // Default to first stock
  }, []);

  const onEmotionSelect = (emotion) => {
    setViewedEmotion(normalizeOverlayEmotion(emotion));
  };
  const normalizeOverlayEmotion = (e) => ({
    emotion: e.label,
    reason: e.reason || "No explanation provided",
    smart_money: e.smart_money || "—",
    retailers: e.retailers || "—",
    confidence: e.confidence || 70,
    entry: { price: e.price, direction: "N/A" },
    exit: { stopLoss: e.price - 100, target: e.price + 300 },
    tla: {
      trend: "N/A",
      currentPrice: e.price,
      swingHigh: e.price + 50,
      swingLow: e.price - 50,
      action: "N/A"
    },
    levels: {}
  });

  const activeEmotionData = viewedEmotion || mockEmotionData;

  return (
    <div className="dashboard">
      <header className="header">Trading Assistant</header>
      <main className="main-content">
        <aside className="sidebar">
          <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
            borderRight: "1px solid #ddd",
            backgroundColor: "#fafafa"
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 16px 10px 16px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #e0e0e0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              position: 'fixed',
            }}>
              <MdBarChart size={18} color="#444" style={{ marginRight: '8px' }} />
              <div style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#222',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Stocks with Setups
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#666',
                  padding: '1px 6px',
                  borderLeft: '1px solid #ccc'
                }}>
                  {stockList.length}
                </span>
              </div>
            </div>
            <div style={{
              padding: "12px 14px",
            }}>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <StockList
                stocks={stockList}
                activeSymbol={selectedStock?.symbol}
                onSelect={setSelectedStock}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </aside>

        <section className="chart">
          {/* The ChartPanel now draws dimmed entry/stop/target lines automatically */}
          <ChartPanel selectedStock={selectedStock} viewedEmotion={viewedEmotion} onEmotionSelect={onEmotionSelect} />
        </section>

        <aside className="insights">
          {/* Emotion detail panel */}
          <EmotionInsightPanel
            data={activeEmotionData}
            selectedEmotion={viewedEmotion}
            onBack={() => {
              setViewedEmotion(null);
            }}
          />

        </aside>
      </main>
    </div>
  );
}
