import { useState, useEffect } from 'react';

// Collection of 2D SVG logos
const logos = [
  // 1. Layered S Logo
  {
    name: 'LayeredS',
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M70 25 Q85 25 85 40 Q85 55 70 55 L30 55 Q15 55 15 70 Q15 85 30 85 L70 85" 
          fill="none" stroke="#ff9800" strokeWidth="8" strokeLinecap="round"/>
        <path d="M68 20 Q83 20 83 35 Q83 50 68 50 L32 50 Q17 50 17 65 Q17 80 32 80 L68 80" 
          fill="none" stroke="#ff9800" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
      </svg>
    )
  },
  
  // 2. Blade Icon
  {
    name: 'Blade',
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="45" width="60" height="10" fill="#c0c0c0" rx="2"/>
        <rect x="22" y="46" width="56" height="8" fill="#ff9800" opacity="0.3"/>
        <line x1="50" y1="30" x2="50" y2="70" stroke="#ff9800" strokeWidth="2" opacity="0.5"/>
      </svg>
    )
  },
  
  // 3. Layer Stack Icon
  {
    name: 'Layers',
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="70" width="50" height="8" fill="#6B6B6B" rx="2"/>
        <rect x="28" y="58" width="44" height="8" fill="#6B6B6B" rx="2"/>
        <rect x="31" y="46" width="38" height="8" fill="#6B6B6B" rx="2"/>
        <rect x="34" y="34" width="32" height="8" fill="#6B6B6B" rx="2"/>
        <rect x="37" y="22" width="26" height="8" fill="#ff9800" rx="2"/>
      </svg>
    )
  },
  
  // 4. Cube Wireframe Icon
  {
    name: 'Cube',
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" 
          fill="none" stroke="#ff9800" strokeWidth="3"/>
        <line x1="50" y1="20" x2="50" y2="80" stroke="#ff9800" strokeWidth="2"/>
        <line x1="20" y1="35" x2="80" y2="35" stroke="#ff9800" strokeWidth="2"/>
        <line x1="20" y1="65" x2="80" y2="65" stroke="#ff9800" strokeWidth="2"/>
      </svg>
    )
  },
  
  // 5. Printer Nozzle Icon
  {
    name: 'Nozzle',
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="20" width="30" height="25" fill="#6B6B6B" rx="2"/>
        <path d="M35 45 L30 60 L50 60 L50 45 Z M50 45 L50 60 L70 60 L65 45 Z" fill="#ff9800"/>
        <rect x="45" y="60" width="10" height="15" fill="#ff9800" opacity="0.5"/>
        <circle cx="50" cy="78" r="3" fill="#ff9800" opacity="0.3"/>
      </svg>
    )
  },
  
  // 6. Spiral Icon
  {
    name: 'Spiral',
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 50 Q70 50 70 70 Q70 90 50 90 Q30 90 30 70 Q30 50 50 50 Q70 50 70 30 Q70 10 50 10 Q30 10 30 30" 
          fill="none" stroke="#ff9800" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="5" fill="#ff9800"/>
      </svg>
    )
  },
  
  // 7. Geometric S
  {
    name: 'GeoS',
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 30 L75 30 L75 45 L25 45 L25 55 L75 55 L75 70 L25 70" 
          fill="none" stroke="#ff9800" strokeWidth="8" strokeLinejoin="miter"/>
      </svg>
    )
  },
  
  // 8. Print Bed Icon
  {
    name: 'PrintBed',
    svg: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="60" width="60" height="5" fill="#6B6B6B"/>
        <line x1="20" y1="60" x2="35" y2="35" stroke="#ff9800" strokeWidth="2"/>
        <line x1="80" y1="60" x2="65" y2="35" stroke="#ff9800" strokeWidth="2"/>
        <line x1="35" y1="35" x2="65" y2="35" stroke="#ff9800" strokeWidth="3"/>
        <rect x="42" y="40" width="16" height="20" fill="#ff9800" opacity="0.3"/>
        {[...Array(5)].map((_, i) => (
          <line key={i} x1="25" y1={70 + i*5} x2="75" y2={70 + i*5} 
            stroke="#6B6B6B" strokeWidth="1" opacity="0.3"/>
        ))}
      </svg>
    )
  }
];

export const Logo2D = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {logos[currentIndex].svg}
    </div>
  );
};
