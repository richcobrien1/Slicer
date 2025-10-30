import { useState, useEffect } from 'react';

// Collection of animated SVG icons
const icons = [
  // Cube wireframe
  <svg key="cube" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g className="rotate-icon">
      <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" 
        fill="none" stroke="#ff9800" strokeWidth="3"/>
      <line x1="50" y1="20" x2="50" y2="80" stroke="#ff9800" strokeWidth="2"/>
      <line x1="20" y1="35" x2="80" y2="35" stroke="#ff9800" strokeWidth="2"/>
    </g>
  </svg>,
  
  // Layer stack
  <svg key="layers" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g className="pulse-icon">
      <rect x="25" y="65" width="50" height="8" fill="#6B6B6B" rx="2"/>
      <rect x="28" y="53" width="44" height="8" fill="#6B6B6B" rx="2"/>
      <rect x="31" y="41" width="38" height="8" fill="#6B6B6B" rx="2"/>
      <rect x="34" y="29" width="32" height="8" fill="#ff9800" rx="2"/>
    </g>
  </svg>,
  
  // Container
  <svg key="container" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g className="rotate-icon">
      <rect x="30" y="30" width="40" height="40" fill="none" stroke="#ff9800" strokeWidth="3" rx="2"/>
      <line x1="35" y1="30" x2="35" y2="70" stroke="#6B6B6B" strokeWidth="1"/>
      <line x1="40" y1="30" x2="40" y2="70" stroke="#6B6B6B" strokeWidth="1"/>
      <line x1="60" y1="30" x2="60" y2="70" stroke="#6B6B6B" strokeWidth="1"/>
      <line x1="65" y1="30" x2="65" y2="70" stroke="#6B6B6B" strokeWidth="1"/>
    </g>
  </svg>,
  
  // Nozzle
  <svg key="nozzle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g className="pulse-icon">
      <rect x="35" y="20" width="30" height="25" fill="#6B6B6B" rx="2"/>
      <path d="M35 45 L30 60 L50 60 L50 45 Z M50 45 L50 60 L70 60 L65 45 Z" fill="#ff9800"/>
      <circle cx="50" cy="70" r="3" fill="#ff9800" opacity="0.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
      </circle>
    </g>
  </svg>,
];

export const RotatingModelIcon = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % icons.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes rotate-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-anim {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .rotate-icon {
          transform-origin: center;
          animation: rotate-anim 4s linear infinite;
        }
        .pulse-icon {
          transform-origin: center;
          animation: pulse-anim 2s ease-in-out infinite;
        }
      `}</style>
      {icons[currentIndex]}
    </div>
  );
};
