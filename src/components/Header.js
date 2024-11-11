import React from 'react';

const Header = () => {
  return (
    <header style={{
      background: 'linear-gradient(90deg, #000000, #00008B)',
      padding: '20px',
      textAlign: 'center',
      color: 'white',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem' }}>
        Traffic Accidents Analysis and Visualization
      </h1>
    </header>
  );
};

export default Header;
