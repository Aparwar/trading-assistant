import React from 'react';
import { IoClose } from 'react-icons/io5';
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search stock..."
                value={value}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
            />
            {value && (
                <IoClose
                    className="clear-icon"
                    size={18}
                    onClick={() => onChange('')}
                />
            )}
        </div>
    );
};

export default SearchBar;
