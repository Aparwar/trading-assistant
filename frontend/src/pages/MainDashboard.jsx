import './MainDashboard.css';
import ChartPanel from '../components/ChartPanel';

const mockCandleData = [
  { time: "2024-07-01", open: 123, high: 125, low: 122, close: 124 },
  { time: "2024-07-02", open: 124, high: 127, low: 123, close: 126 },
  { time: "2024-07-03", open: 126, high: 130, low: 125, close: 128 },
  { time: "2024-07-04", open: 128, high: 133, low: 127, close: 132 },
  { time: "2024-07-05", open: 132, high: 135, low: 130, close: 134 },
  { time: "2024-07-06", open: 134, high: 136, low: 133, close: 135 },
  { time: "2024-07-07", open: 135, high: 139, low: 134, close: 138 },
  { time: "2024-07-08", open: 138, high: 141, low: 137, close: 140 },
  { time: "2024-07-09", open: 140, high: 144, low: 139, close: 143 },
  { time: "2024-07-10", open: 143, high: 147, low: 142, close: 146 },
];

export default function MainDashboard() {
  return (
    <div className="dashboard">
      <header className="header">🚀 Trading Assistant — MOCKUP v13 Layout</header>
      <main className="main-content">
        <aside className="sidebar">
          <h2>📋 Stock List</h2>
          <p>CANBK</p>
          <p>SBIN</p>
          <p>RELIANCE</p>
        </aside>
        <section className="chart">
          <ChartPanel candleData={mockCandleData} />
        </section>
        <aside className="insights">
          <h2>🧠 Emotion + Entry Panel</h2>
          <p>Fear, Trap, Greed overlays will appear here.</p>
        </aside>
      </main>
    </div>
  );
}