// Header.jsx
import React from 'react';
import './Header.css';

export default function Header({ title, subtitle, actions }) {
    return (
        <div className="screen-header">
            <div className="header-text">
                <h2>{title}</h2>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="header-actions">{actions}</div>
        </div>
    );
}
