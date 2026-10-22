import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ variant = 'light', size = 'default', showSubtitle = true, to = '/' }) => {
  const isLight = variant === 'light'; // Light text for dark backgrounds (e.g. sidebar, footer, login hero)
  const isLarge = size === 'large';
  const emblemDim = isLarge ? 42 : 34;

  // Colors based on theme variant
  const primaryLeaf = isLight ? '#FFFDF7' : '#173F2A';
  const secondaryLeaf = isLight ? '#E2EBD8' : '#103B27';
  const goldAccent = '#D6A84F';
  const nodeCenter = isLight ? '#103B27' : '#173F2A';
  const baseFurrow = isLight ? '#FFFDF7' : '#173F2A';
  const textPrimary = isLight ? '#FFFDF7' : '#173F2A';
  const textSubtitle = isLight ? '#D6A84F' : '#4D554E';

  return (
    <Link 
      to={to} 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isLarge ? '12px' : '10px',
        textDecoration: 'none'
      }}
      aria-label="Bharat Krishi Intelligence Grid (BKIG)"
    >
      {/* Unique Botanical & Connected Intelligence Grid Emblem */}
      <svg 
        width={emblemDim} 
        height={emblemDim} 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: 'block' }}
        role="img"
        aria-label="BKIG Sprout & Intelligence Grid Emblem"
      >
        {/* Subtle fertile soil furrow base */}
        <path 
          d="M11 31.5C13.8 33 22.2 33 25 31.5" 
          stroke={baseFurrow} 
          strokeWidth="1.6" 
          strokeLinecap="round" 
          opacity="0.38"
        />

        {/* Left primary sprout leaf */}
        <path 
          d="M18 30C13 28.5 7 22.5 7 15C7 9.8 11.5 6.2 16.5 5.5C15.2 9 13.5 13 13.5 17.5C13.5 22.5 16 26.5 18 30Z" 
          fill={primaryLeaf}
        />

        {/* Right complementary growth leaf */}
        <path 
          d="M18 30C21.5 28.5 29 23 29 15.5C29 11 25.5 7.5 20.5 7C21.8 9.5 22.5 13.5 22.5 17.5C22.5 22 20.5 26 18 30Z" 
          fill={secondaryLeaf}
        />

        {/* Central stem / Telemetry spine */}
        <line 
          x1="18" 
          y1="31" 
          x2="18" 
          y2="5.5" 
          stroke={goldAccent} 
          strokeWidth="1.8" 
          strokeLinecap="round"
        />

        {/* Diagonal intelligence grid links / leaf venation */}
        <line x1="18" y1="23.5" x2="12" y2="19" stroke={goldAccent} strokeWidth="1.3" strokeLinecap="round" />
        <line x1="18" y1="23.5" x2="24" y2="19" stroke={goldAccent} strokeWidth="1.3" strokeLinecap="round" />
        <line x1="18" y1="15" x2="12.5" y2="11.5" stroke={goldAccent} strokeWidth="1.3" strokeLinecap="round" />
        <line x1="18" y1="15" x2="23.5" y2="11.5" stroke={goldAccent} strokeWidth="1.3" strokeLinecap="round" />

        {/* Precision telemetry / sensor nodes */}
        <circle cx="12" cy="19" r="1.4" fill={goldAccent} />
        <circle cx="24" cy="19" r="1.4" fill={goldAccent} />
        <circle cx="12.5" cy="11.5" r="1.3" fill={goldAccent} />
        <circle cx="23.5" cy="11.5" r="1.3" fill={goldAccent} />
        <circle cx="18" cy="23.5" r="1.7" fill={nodeCenter} stroke={goldAccent} strokeWidth="1.2" />
        <circle cx="18" cy="15" r="1.7" fill={nodeCenter} stroke={goldAccent} strokeWidth="1.2" />

        {/* Golden Apex Dhanya Seed (Grain of Prosperity) */}
        <path d="M18 3L20 5.2L18 7.4L16 5.2Z" fill={goldAccent} />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <div style={{
          fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
          fontWeight: 700,
          fontSize: isLarge ? '1.55rem' : '1.32rem',
          letterSpacing: '-0.02em',
          color: textPrimary
        }}>
          BKIG
        </div>
        {showSubtitle && (
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: isLarge ? '0.72rem' : '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: textSubtitle
          }}>
            Bharat Krishi Intelligence Grid
          </div>
        )}
      </div>
    </Link>
  );
};

export default Logo;
