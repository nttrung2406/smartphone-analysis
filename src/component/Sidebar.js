import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/global.css'; 

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sidebar-container">
      <nav>
        <ul className="sidebar-nav">
          <li>
            <Link to="/overview" className="link-style">Overview</Link>
          </li>

          {/* Toggle for the Statistics dropdown */}
          <li>
            <div onClick={toggleDropdown} className="link-style dropdown-toggle" style={{ cursor: 'pointer' }}>
              Statistics 
              {/* Chevron icon */}
              <span className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            {isDropdownOpen && (
              <ul className="sidebar-dropdown">
                <li>
                  <Link to="/statistics/singular" className="dropdown-link-style">
                    Singular Feature
                  </Link>
                </li>
                <li>
                  <Link to="/statistics/multiple" className="dropdown-link-style">
                    Multiple Features
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/prediction" className="link-style">Prediction</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
