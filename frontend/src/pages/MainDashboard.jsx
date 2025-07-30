import './MainDashboard.css';
import ChartPanel from '../components/ChartPanel';
import StockListCard from '../components/StockListCard';
import { MdBarChart } from 'react-icons/md';

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
  return (
    <div className="dashboard">
      <header className="header">🚀 Trading Assistant — MOCKUP v13 Layout</header>
      <main className="main-content">
        <aside className="sidebar">
          {/* Sidebar: Stock List */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            borderRight: "1px solid #ddd",
            backgroundColor: "#fafafa"
          }}>
            {/* Header stays fixed */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 16px 10px 16px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #e0e0e0',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}>
              {/* Icon */}
              <MdBarChart size={18} color="#444" style={{ marginRight: '8px' }} />

              {/* Heading + count */}
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


            {/* Scrollable stock list */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px 20px 14px",
            }}>
              {stockList.map((stock) => (
                <StockListCard key={stock.symbol} {...stock} />
              ))}
            </div>
          </div>

        </aside>
        <section className="chart">
          <ChartPanel />
        </section>
        <aside className="insights">
          <h2>🧠 Emotion + Entry Panel</h2>
          <p>Fear, Trap, Greed overlays will appear here.</p>
        </aside>
      </main>
    </div>
  );
}