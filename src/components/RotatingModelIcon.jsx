import { useState, useEffect } from 'react';

// Collection of animated SVG icons
const icons = [
  // 3D Cube
  <svg key="cube" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g className="rotate-icon">
      <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" 
        fill="none" stroke="#ff9800" strokeWidth="3"/>
      <line x1="50" y1="20" x2="50" y2="80" stroke="#ff9800" strokeWidth="2"/>
      <line x1="20" y1="35" x2="80" y2="35" stroke="#ff9800" strokeWidth="2"/>
      <line x1="20" y1="65" x2="80" y2="65" stroke="#ff9800" strokeWidth="2"/>
      <polygon points="50,20 80,35 50,50 20,35" fill="#ff9800" opacity="0.3"/>
    </g>
  </svg>,
  
  // Triangle/Pyramid
  <svg key="triangle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g className="rotate-icon">
      <path d="M50 15 L85 75 L15 75 Z" fill="none" stroke="#ff9800" strokeWidth="3"/>
      <line x1="50" y1="15" x2="50" y2="75" stroke="#ff9800" strokeWidth="2" opacity="0.5"/>
      <line x1="50" y1="15" x2="15" y2="75" stroke="#ff9800" strokeWidth="2"/>
      <line x1="50" y1="15" x2="85" y2="75" stroke="#ff9800" strokeWidth="2"/>
      <polygon points="50,15 85,75 50,50" fill="#ff9800" opacity="0.2"/>
      <polygon points="50,15 15,75 50,50" fill="#ff9800" opacity="0.3"/>
    </g>
  </svg>,
  
  // Globe
  <svg key="globe" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g className="rotate-icon">
      <circle cx="50" cy="50" r="35" fill="none" stroke="#ff9800" strokeWidth="3"/>
      <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="#ff9800" strokeWidth="2"/>
      <ellipse cx="50" cy="50" rx="15" ry="35" fill="none" stroke="#ff9800" strokeWidth="2"/>
      <line x1="50" y1="15" x2="50" y2="85" stroke="#ff9800" strokeWidth="2"/>
      <circle cx="50" cy="50" r="3" fill="#ff9800"/>
      <path d="M50 50 Q65 35 70 30" stroke="#ff9800" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M50 50 Q35 65 30 70" stroke="#ff9800" strokeWidth="1.5" fill="none" opacity="0.5"/>
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
