import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  TrendingUp, 
  ScrollText, 
  ArrowRight, 
  Play, 
  X, 
  Sprout, 
  CheckCircle2
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export const LandingPage = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div 
      style={{ 
        backgroundColor: '#F7F1E3', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        color: '#173F2A',
        fontFamily: "var(--font-body)",
        overflowX: 'hidden'
      }}
    >
      <Navbar />

      {/* =========================================================================
          HERO SECTION — EXACT BKIG REPLICATION
          Two-column desktop layout with organic curved farmer visual
          ========================================================================= */}
      {/* =========================================================================
          HERO SECTION — FULL-SCREEN IMMERSIVE AGRICULTURAL EXPERIENCE
          Two-column layout filling available viewport height beneath header
          ========================================================================= */}
      <section 
        className="hero-section"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#F7F1E3',
          overflow: 'hidden',
          padding: 'clamp(0.5rem, 1.2vh, 1.25rem) 0',
          boxSizing: 'border-box'
        }}
      >
        {/* Fine-line botanical decoration near hero top-left */}
        <svg 
          style={{
            position: 'absolute',
            top: '10px',
            left: '12px',
            width: '110px',
            height: '110px',
            opacity: 0.22,
            pointerEvents: 'none',
            zIndex: 0
          }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <path d="M10 90 Q30 50 60 30 Q80 15 95 10" stroke="#173F2A" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M28 65 C22 55 24 45 32 46 C40 47 40 58 28 65 Z" fill="#173F2A" />
          <path d="M46 48 C42 36 48 28 56 32 C62 36 58 46 46 48 Z" fill="#D6A84F" />
          <path d="M68 32 C68 20 78 16 82 22 C86 28 80 36 68 32 Z" fill="#173F2A" />
          <circle cx="85" cy="18" r="2" fill="#D6A84F" />
        </svg>

        <div 
          className="container hero-container" 
          style={{ 
            position: 'relative', 
            zIndex: 1, 
            width: '100%', 
            maxWidth: '1440px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            height: '100%'
          }}
        >
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)',
              gap: 'clamp(2rem, 3.5vw, 4rem)',
              alignItems: 'center',
              width: '100%'
            }}
            className="hero-grid"
          >
            {/* ----------------- LEFT HERO COLUMN ----------------- */}
            <div className="hero-content-group" style={{ maxWidth: '580px', width: '100%' }}>
              {/* Short harvest-gold line followed by Eyebrow */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: 'clamp(0.85rem, 1.8vh, 1.35rem)'
                }}
              >
                <span 
                  style={{
                    width: '38px',
                    height: '2.5px',
                    backgroundColor: '#D6A84F',
                    display: 'inline-block',
                    borderRadius: '2px'
                  }} 
                />
                <span 
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 'clamp(0.78rem, 0.95vw, 0.86rem)',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    color: '#173F2A',
                    textTransform: 'uppercase'
                  }}
                >
                  AI-POWERED INSIGHTS
                </span>
              </div>

              {/* Main Heading */}
              <h1 
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 'clamp(2.5rem, 3.8vw, 3.85rem)',
                  lineHeight: 1.1,
                  color: '#173F2A',
                  fontWeight: 700,
                  marginBottom: 'clamp(1rem, 2vh, 1.45rem)',
                  letterSpacing: '-0.025em'
                }}
              >
                Empowering<br />
                Farmers Today<br />
                for a <span style={{ color: '#D6A84F' }}>Brighter</span><br />
                Tomorrow
              </h1>

              {/* Supporting Text */}
              <p 
                style={{
                  fontSize: 'clamp(0.98rem, 1.2vw, 1.14rem)',
                  color: '#4D554E',
                  lineHeight: 1.62,
                  marginBottom: 'clamp(1.4rem, 2.5vh, 2.25rem)',
                  maxWidth: '520px'
                }}
              >
                Crop insurance, daily market prices when available, and official government scheme links — built for every farmer.
              </p>

              {/* Hero Actions: Get Started + Watch Video */}
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '1.25rem',
                  marginBottom: 'clamp(1.4rem, 2.5vh, 2.25rem)'
                }}
              >
                <Link 
                  to="/role-selection" 
                  className="hero-primary-btn"
                  style={{
                    backgroundColor: '#173F2A',
                    color: '#FFFFFF',
                    border: '1px solid #173F2A',
                    padding: '0.82rem 2.1rem',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 16px rgba(23, 63, 42, 0.24)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </Link>

                <button 
                  onClick={() => setVideoModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem',
                    color: '#173F2A',
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: '0.98rem'
                  }}
                  aria-label="Watch Video Introduction"
                >
                  <span 
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: '1.5px solid #D2CDC0',
                      backgroundColor: '#FFFDF7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(23, 63, 42, 0.08)',
                      transition: 'transform 0.2s ease'
                    }}
                    className="play-icon-circle"
                  >
                    <Play size={16} fill="#173F2A" color="#173F2A" style={{ marginLeft: '2px' }} />
                  </span>
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Tagline with harvest-gold vertical line */}
              <div 
                style={{
                  borderLeft: '2.5px solid #D6A84F',
                  paddingLeft: '1rem',
                  fontFamily: "var(--font-heading)",
                  fontStyle: 'italic',
                  color: '#173F2A',
                  fontSize: 'clamp(0.98rem, 1.15vw, 1.1rem)',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  lineHeight: 1.35
                }}
              >
                “Healthy Farms. Prosperous Farmers. A Stronger Bharat.”
              </div>
            </div>

            {/* ----------------- RIGHT HERO VISUAL (ORGANIC CURVED FARMER IMAGE) ----------------- */}
            <div 
              style={{ 
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
              className="hero-visual-wrapper"
            >
              {/* Handwritten-style Tagline Overlay at Upper-Right */}
              <div 
                className="handwritten-tagline"
                style={{
                  position: 'absolute',
                  top: '-24px',
                  right: '20px',
                  zIndex: 8,
                  textAlign: 'right',
                  pointerEvents: 'none'
                }}
              >
                <div 
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: 'clamp(1.55rem, 1.9vw, 1.85rem)',
                    fontWeight: 700,
                    lineHeight: 1.18,
                    color: '#103B27',
                    textShadow: '0 1px 4px rgba(247, 241, 227, 0.95), 0 0 10px rgba(247, 241, 227, 0.85)'
                  }}
                >
                  <div>Healthy Farms</div>
                  <div>Prosperous Farmers</div>
                  <div>A Stronger Bharat</div>
                </div>
                <div 
                  style={{
                    width: '48px',
                    height: '2px',
                    backgroundColor: '#D6A84F',
                    marginLeft: 'auto',
                    marginTop: '4px',
                    borderRadius: '1px'
                  }} 
                />
              </div>

              {/* SVG Definition for Organic Curved Image Mask */}
              <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
                <defs>
                  <clipPath id="hero-organic-mask" clipPathUnits="objectBoundingBox">
                    <path d="M 0.22 0 L 0.96 0 Q 1 0 1 0.04 L 1 0.94 Q 1 1 0.94 1 C 0.70 0.98, 0.45 1, 0.18 0.98 C 0.08 0.97, 0.02 0.94, 0 0.86 L 0 0.42 C 0 0.18, 0.08 0, 0.22 0 Z" />
                  </clipPath>
                </defs>
              </svg>

              {/* Large Organic Curved Container for Agricultural Photograph */}
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '800px',
                  height: 'clamp(520px, 80vh, 830px)',
                  clipPath: 'url(#hero-organic-mask)',
                  WebkitClipPath: 'url(#hero-organic-mask)',
                  filter: 'drop-shadow(0 20px 42px rgba(23, 63, 42, 0.13))',
                  backgroundColor: 'transparent',
                  transition: 'all 0.4s ease'
                }}
                className="organic-hero-shape"
              >
                <img 
                  src="/images/farmer-hero.jpg" 
                  alt="Indian farmer viewed from behind standing in lush green agricultural field at warm sunset"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 35%',
                    display: 'block'
                  }}
                  loading="eager"
                />

                {/* Left-edge soft ivory blend overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '26%',
                    background: 'linear-gradient(to right, rgba(247, 241, 227, 0.4) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Subtle bottom warm vignette overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(247, 241, 227, 0.02) 0%, rgba(23, 63, 42, 0.22) 100%)',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {/* Cream Information Card Overlay at Lower-Right */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '16px',
                  backgroundColor: '#FFFDF7',
                  borderRadius: '16px',
                  padding: '0.9rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 12px 32px rgba(23, 63, 42, 0.15)',
                  border: '1.5px solid #ECE3D4',
                  zIndex: 7,
                  maxWidth: '315px'
                }}
                className="floating-info-card"
              >
                <div 
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#EEF3E6',
                    border: '1px solid #DDE4D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Sprout size={22} color="#173F2A" />
                </div>
                <div>
                  <div 
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: '#173F2A',
                      lineHeight: 1.25,
                      marginBottom: '4px'
                    }}
                  >
                    Better Insights for Better Decisions
                  </div>
                  <div 
                    style={{
                      width: '32px',
                      height: '2px',
                      backgroundColor: '#D6A84F',
                      borderRadius: '1px'
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE CARDS — EXACTLY THREE IN ONE HORIZONTAL ROW
          ========================================================================= */}
      <section 
        id="features" 
        style={{ 
          padding: 'clamp(2.5rem, 5vw, 4.5rem) 0 clamp(3.5rem, 6vw, 5rem)', 
          backgroundColor: '#F7F1E3'
        }}
      >
        <div className="container">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              alignItems: 'stretch'
            }}
            className="features-grid"
          >
            {/* ----------------- CARD 1: CROP INSURANCE FRAUD DETECTION ----------------- */}
            <div 
              style={{
                backgroundColor: '#EDF3E7',
                border: '1.5px solid #D2DEC6',
                borderRadius: '22px',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 6px 20px rgba(23, 63, 42, 0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="feature-card"
            >
              {/* Subtle Botanical SVG Motif */}
              <svg 
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '52px',
                  height: '52px',
                  opacity: 0.18,
                  pointerEvents: 'none'
                }}
                viewBox="0 0 48 48"
                fill="none"
              >
                <path d="M24 4C24 4 12 16 12 28C12 34 17 40 24 44C31 40 36 34 36 28C36 16 24 4 24 4Z" fill="#173F2A" />
                <path d="M24 10V40" stroke="#173F2A" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {/* Forest-green Rounded-square Icon Container with White Shield Icon */}
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#173F2A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.4rem',
                  boxShadow: '0 4px 10px rgba(23, 63, 42, 0.16)'
                }}
              >
                <ShieldCheck size={28} color="#FFFFFF" />
              </div>

              {/* Title */}
              <h3 
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: '1.32rem',
                  fontWeight: 700,
                  color: '#173F2A',
                  marginBottom: '0.75rem',
                  lineHeight: 1.25
                }}
              >
                Crop Insurance Fraud Detection
              </h3>

              {/* Description */}
              <p 
                style={{
                  color: '#4D554E',
                  fontSize: '0.96rem',
                  lineHeight: 1.6,
                  flex: 1,
                  marginBottom: '1.75rem'
                }}
              >
                Fair and transparent claim assessment using AI.
              </p>

              {/* Circular Arrow Button on Right */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link 
                  to="/farmer/submit-claim" 
                  aria-label="Crop Insurance Fraud Detection"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#173F2A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease, background-color 0.2s ease',
                    boxShadow: '0 3px 10px rgba(23, 63, 42, 0.2)'
                  }}
                  className="arrow-circle-btn"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* ----------------- CARD 2: MANDI PRICE INTELLIGENCE ----------------- */}
            <div 
              style={{
                backgroundColor: '#FAF3E4',
                border: '1.5px solid #EADBBA',
                borderRadius: '22px',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 6px 20px rgba(214, 168, 79, 0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="feature-card"
            >
              {/* Subtle Botanical SVG Motif */}
              <svg 
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '52px',
                  height: '52px',
                  opacity: 0.2,
                  pointerEvents: 'none'
                }}
                viewBox="0 0 48 48"
                fill="none"
              >
                <path d="M24 6C24 6 16 14 16 24C16 30 20 36 24 40C28 36 32 30 32 24C32 14 24 6 24 6Z" fill="#D6A84F" />
                <path d="M24 10V38" stroke="#D6A84F" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {/* Gold Rounded-square Icon Container with White Bar-Chart Icon */}
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#D6A84F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.4rem',
                  boxShadow: '0 4px 10px rgba(214, 168, 79, 0.2)'
                }}
              >
                <TrendingUp size={28} color="#FFFFFF" />
              </div>

              {/* Title */}
              <h3 
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: '1.32rem',
                  fontWeight: 700,
                  color: '#173F2A',
                  marginBottom: '0.75rem',
                  lineHeight: 1.25
                }}
              >
                Mandi Price Intelligence
              </h3>

              {/* Description */}
              <p 
                style={{
                  color: '#4D554E',
                  fontSize: '0.96rem',
                  lineHeight: 1.6,
                  flex: 1,
                  marginBottom: '1.75rem'
                }}
              >
                Compare market prices and choose the best selling option.
              </p>

              {/* Circular Arrow Button on Right */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link 
                  to="/farmer/mandi-prices" 
                  aria-label="Mandi Price Intelligence"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#173F2A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease, background-color 0.2s ease',
                    boxShadow: '0 3px 10px rgba(23, 63, 42, 0.2)'
                  }}
                  className="arrow-circle-btn"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* ----------------- CARD 3: GOVERNMENT SCHEME FINDER ----------------- */}
            <div 
              style={{
                backgroundColor: '#F9EFEB',
                border: '1.5px solid #ECCDC1',
                borderRadius: '22px',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 6px 20px rgba(166, 75, 42, 0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="feature-card"
            >
              {/* Subtle Botanical SVG Motif */}
              <svg 
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '52px',
                  height: '52px',
                  opacity: 0.18,
                  pointerEvents: 'none'
                }}
                viewBox="0 0 48 48"
                fill="none"
              >
                <path d="M24 6C24 6 14 16 14 26C14 32 18 38 24 42C30 38 34 32 34 26C34 16 24 6 24 6Z" fill="#A64B2A" />
                <path d="M24 10V38" stroke="#A64B2A" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {/* Terracotta Rounded-square Icon Container with White Document Icon */}
              <div 
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#A64B2A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.4rem',
                  boxShadow: '0 4px 10px rgba(166, 75, 42, 0.2)'
                }}
              >
                <ScrollText size={28} color="#FFFFFF" />
              </div>

              {/* Title */}
              <h3 
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: '1.32rem',
                  fontWeight: 700,
                  color: '#173F2A',
                  marginBottom: '0.75rem',
                  lineHeight: 1.25
                }}
              >
                Government Scheme Finder
              </h3>

              {/* Description */}
              <p 
                style={{
                  color: '#4D554E',
                  fontSize: '0.96rem',
                  lineHeight: 1.6,
                  flex: 1,
                  marginBottom: '1.75rem'
                }}
              >
                Find schemes you are eligible for with ease.
              </p>

              {/* Circular Arrow Button on Right */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link 
                  to="/farmer/schemes" 
                  aria-label="Government Scheme Finder"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#173F2A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease, background-color 0.2s ease',
                    boxShadow: '0 3px 10px rgba(23, 63, 42, 0.2)'
                  }}
                  className="arrow-circle-btn"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VISION SECTION — EXACT LOWER SECTION REPLICATION
          Pale Sage Green background with soft flowing organic top edge
          Left: Label + Heading | Middle: Description | Right: Rural Landscape with cursive text
          ========================================================================= */}
      <section 
        id="impact" 
        style={{ 
          position: 'relative',
          backgroundColor: '#DDE4D0',
          paddingTop: '0',
          paddingBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
          overflow: 'hidden'
        }}
      >
        {/* Soft flowing organic top edge transition from Ivory to Pale Sage Green */}
        <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, backgroundColor: '#F7F1E3' }}>
          <svg 
            viewBox="0 0 1440 70" 
            fill="none" 
            style={{ width: '100%', height: 'clamp(40px, 5vw, 65px)', display: 'block' }}
            preserveAspectRatio="none"
          >
            <path 
              d="M0,28 C280,68 580,8 920,48 C1160,74 1340,32 1440,36 L1440,70 L0,70 Z" 
              fill="#DDE4D0" 
            />
          </svg>
        </div>

        {/* Botanical foliage illustration along left side */}
        <svg 
          style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            width: '180px',
            height: '240px',
            opacity: 0.22,
            pointerEvents: 'none',
            zIndex: 0
          }}
          viewBox="0 0 180 240"
          fill="none"
        >
          <path d="M0 240 Q40 180 60 120 Q80 60 110 0" stroke="#173F2A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 165 C52 145 68 150 64 165 C58 178 46 178 42 165 Z" fill="#173F2A" />
          <path d="M60 120 C75 105 92 112 85 128 C78 140 65 135 60 120 Z" fill="#D6A84F" />
          <path d="M82 75 C100 62 115 72 106 88 C98 100 86 92 82 75 Z" fill="#173F2A" />
          <path d="M20 200 C32 185 45 190 40 202 C35 212 24 210 20 200 Z" fill="#173F2A" />
        </svg>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '1.5rem' }}>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1.15fr) minmax(260px, 1fr) minmax(320px, 1.25fr)',
              gap: 'clamp(2rem, 3.5vw, 3.5rem)',
              alignItems: 'center'
            }}
            className="vision-grid"
          >
            {/* ----------------- LEFT SIDE: LABEL & MAIN HEADING ----------------- */}
            <div>
              {/* Small uppercase label "OUR VISION" + short gold line */}
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '1rem'
                }}
              >
                <span 
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    color: '#173F2A',
                    textTransform: 'uppercase'
                  }}
                >
                  OUR VISION
                </span>
                <span 
                  style={{
                    width: '38px',
                    height: '2.5px',
                    backgroundColor: '#D6A84F',
                    display: 'inline-block',
                    borderRadius: '2px'
                  }} 
                />
              </div>

              {/* Main Heading */}
              <h2 
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 'clamp(2.3rem, 3.6vw, 3.2rem)',
                  lineHeight: 1.15,
                  color: '#173F2A',
                  fontWeight: 700,
                  letterSpacing: '-0.02em'
                }}
              >
                Stronger Farmers<br />
                A Better <span style={{ color: '#D6A84F' }}>Bharat</span>
              </h2>
            </div>

            {/* ----------------- MIDDLE: DESCRIPTION ----------------- */}
            <div>
              <p 
                style={{
                  fontSize: 'clamp(1.02rem, 1.4vw, 1.14rem)',
                  color: '#284534',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem'
                }}
              >
                We bring data, technology and market and scheme information together to support a more resilient agricultural community across India.
              </p>

              <Link 
                to="/about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: '0.94rem',
                  color: '#173F2A',
                  paddingBottom: '2px',
                  borderBottom: '2px solid #D6A84F',
                  textDecoration: 'none'
                }}
              >
                <span>Learn more about our architecture</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* ----------------- RIGHT: RURAL LANDSCAPE PHOTOGRAPH + CURSIVE TEXT ----------------- */}
            <div 
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* Handwritten-style Text on Landscape */}
              <div 
                className="vision-handwritten-text"
                style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '16px',
                  zIndex: 4,
                  textAlign: 'right',
                  pointerEvents: 'none'
                }}
              >
                <div 
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '1.65rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: '#103B27',
                    textShadow: '0 1px 4px rgba(221, 228, 208, 0.95)'
                  }}
                >
                  <div>Our Land</div>
                  <div>Our Farmers</div>
                  <div>Our Future</div>
                </div>
                <div 
                  style={{
                    width: '42px',
                    height: '2px',
                    backgroundColor: '#D6A84F',
                    marginLeft: 'auto',
                    marginTop: '4px',
                    borderRadius: '1px'
                  }} 
                />
              </div>

              {/* Organic Curved Container for Rural Landscape Image */}
              <div 
                style={{
                  width: '100%',
                  maxWidth: '440px',
                  height: '290px',
                  borderRadius: '32px 64px 36px 54px',
                  overflow: 'hidden',
                  boxShadow: '0 14px 36px rgba(23, 63, 42, 0.14)',
                  border: '6px solid rgba(255, 253, 247, 0.85)',
                  backgroundColor: '#DDE4D0',
                  position: 'relative'
                }}
                className="rural-landscape-container"
              >
                <img 
                  src="/images/rural-landscape.jpg" 
                  alt="Scenic rural Indian agricultural landscape with green terraced farming and rolling hills"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    display: 'block'
                  }}
                  loading="lazy"
                />

                {/* Soft gradient blend into sage background */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(221, 228, 208, 0.05) 0%, rgba(23, 63, 42, 0.18) 100%)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VIDEO / ARCHITECTURE WALKTHROUGH MODAL
          Interactive modal triggered by "Watch Video" button
          ========================================================================= */}
      {videoModalOpen && (
        <div 
          className="modal-overlay"
          onClick={() => setVideoModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 59, 39, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
        >
          <div 
            style={{
              backgroundColor: '#FFFDF7',
              borderRadius: '22px',
              padding: '2rem',
              maxWidth: '640px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '1.5px solid #E8DFCE',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setVideoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#173F2A',
                padding: '4px'
              }}
              aria-label="Close video walkthrough"
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#EEF3E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sprout size={22} color="#173F2A" />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: '1.35rem', color: '#173F2A' }}>
                Bharat Krishi Intelligence Grid Overview
              </h3>
            </div>

            <p style={{ color: '#4D554E', fontSize: '0.96rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Experience how BKIG unifies satellite telemetry, historical weather indices, and transparent mandi intelligence for Indian agriculture.
            </p>

            {/* Video Preview Card */}
            <div 
              style={{
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: '#103B27',
                color: '#FFFDF7',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                position: 'relative',
                border: '1.5px solid #D6A84F'
              }}
            >
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#D6A84F',
                  color: '#173F2A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <Play size={24} fill="#173F2A" style={{ marginLeft: '3px' }} />
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                BKIG Platform Overview
              </div>
              <div style={{ fontSize: '0.86rem', color: '#DDE4D0', maxWidth: '440px', margin: '0 auto' }}>
                Review claim evidence, explore market information, and find official scheme resources.
              </div>
            </div>

            {/* Feature Bullets */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#173F2A' }}>
                <CheckCircle2 size={16} color="#2A6F4E" />
                <span>AI Fraud Assessment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#173F2A' }}>
                <CheckCircle2 size={16} color="#2A6F4E" />
                <span>Mandi Price Intelligence</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#173F2A' }}>
                <CheckCircle2 size={16} color="#2A6F4E" />
                <span>Welfare Scheme Finder</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#173F2A' }}>
                <CheckCircle2 size={16} color="#2A6F4E" />
                <span>Human-reviewed claim decisions</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setVideoModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              <Link 
                to="/role-selection"
                className="btn btn-primary btn-sm"
                onClick={() => setVideoModalOpen(false)}
                style={{ backgroundColor: '#173F2A', color: '#FFFFFF' }}
              >
                <span>Choose Your Portal</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Responsive & Hover Style Enhancements */}
      <style>{`
        .hero-section {
          min-height: calc(100vh - var(--header-height, 73px));
          min-height: calc(100svh - var(--header-height, 73px));
        }
        .hero-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }
        .hero-primary-btn:hover {
          background-color: #103B27 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(23, 63, 42, 0.3) !important;
        }
        .play-icon-circle:hover {
          transform: scale(1.08);
          background-color: #F7F1E3 !important;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(23, 63, 42, 0.1) !important;
        }
        .arrow-circle-btn:hover {
          transform: scale(1.08);
          background-color: #103B27 !important;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .vision-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
          .vision-grid > div:last-child {
            grid-column: span 2;
          }
        }

        @media (max-width: 960px) {
          .hero-section {
            min-height: auto !important;
            padding: clamp(2rem, 5vw, 3rem) 0 3.5rem 0 !important;
          }
          .hero-container {
            height: auto !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-visual-wrapper {
            flex-direction: column !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .handwritten-tagline {
            position: relative !important;
            top: 0 !important;
            right: 0 !important;
            margin-bottom: 1rem !important;
            text-align: center !important;
          }
          .handwritten-tagline > div:last-child {
            margin: 4px auto 0 !important;
          }
          .organic-hero-shape {
            height: 380px !important;
            max-width: 100% !important;
          }
        }

        @media (max-width: 600px) {
          .organic-hero-shape {
            height: 320px !important;
          }
          .floating-info-card {
            position: relative !important;
            bottom: auto !important;
            right: auto !important;
            margin: 1rem auto 0 !important;
            max-width: 100% !important;
          }
        }

        @media (max-width: 900px) {
          .vision-grid {
            grid-template-columns: 1fr !important;
          }
          .vision-grid > div:last-child {
            grid-column: span 1 !important;
          }
          .vision-handwritten-text {
            position: relative !important;
            top: 0 !important;
            right: 0 !important;
            margin-bottom: 0.75rem !important;
            text-align: center !important;
          }
          .vision-handwritten-text > div:last-child {
            margin: 4px auto 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
