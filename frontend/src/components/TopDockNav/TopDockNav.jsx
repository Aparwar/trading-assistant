// TopDockNav.jsx
import React from 'react';
import './TopDockNav.css';
import { NavLink } from 'react-router-dom';
import { MdHome, MdTimeline, MdExplore, MdAssessment } from 'react-icons/md';

const TopDockNav = () => {
    return (
        <div className="dock-nav">
            <NavLink to="/" className="dock-link">
                <MdHome size={20} />
                <span className="dock-label">Dashboard</span>
            </NavLink>
            <NavLink to="/strategy" className="dock-link">
                <MdTimeline size={20} />
                <span className="dock-label">Strategy</span>
            </NavLink>
            <NavLink to="/explorer" className="dock-link">
                <MdExplore size={20} />
                <span className="dock-label">Explorer</span>
            </NavLink>
            <NavLink to="/backtest" className="dock-link">
                <MdAssessment size={20} />
                <span className="dock-label">Backtest</span>
            </NavLink>
        </div>
    );
};

export default TopDockNav;
