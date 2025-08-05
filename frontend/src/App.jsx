import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopDockNav from './components/TopDockNav/TopDockNav';
import MainDashboard from './screens/MainDashboard';
import StrategyScreen from './screens/StrategyScreen';
import ExplorerScreen from './screens/ExplorerScreen';
import BacktestScreen from './screens/BacktestScreen';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <TopDockNav />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/strategy" element={<StrategyScreen />} />
            <Route path="/explorer" element={<ExplorerScreen />} />
            <Route path="/backtest" element={<BacktestScreen />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
