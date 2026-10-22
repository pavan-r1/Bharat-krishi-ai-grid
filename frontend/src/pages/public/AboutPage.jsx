import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ShieldCheck, Cpu, Database, Sprout, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-ivory-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <section style={{ padding: 'clamp(3rem, 5vw, 5rem) 0 clamp(2rem, 4vw, 3rem)' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Platform Overview
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'var(--color-forest-green)', marginTop: '0.5rem', marginBottom: '1rem' }}>
              About Bharat Krishi Intelligence Grid
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              A unified agricultural intelligence grid bridging rural Indian farmers, agricultural market yards (APMCs), and crop insurance assessment authorities.
            </p>
          </div>

          {/* Mission Card */}
          <div className="card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-forest-green)', marginBottom: '1rem' }}>
              The Problem We Solve
            </h2>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              Indian agriculture faces systemic asymmetries: smallholder farmers often lack access to actionable, timely mandi price comparisons, struggle to identify government welfare subsidies, and experience multi-month delays in crop insurance claim processing under PMFBY. Simultaneously, agricultural insurance officers face challenges verifying thousands of claims during localized weather disasters without objective telemetry.
            </p>
            <p style={{ lineHeight: 1.7 }}>
              <strong>BKIG</strong> addresses these bottlenecks through three interconnected pillars:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--color-sage-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ color: 'var(--color-forest-green)', marginBottom: '0.25rem' }}>1. Insurance Transparency</h4>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>Automated satellite vegetation index (NDVI) and radar rainfall correlation reduces dispute friction.</p>
              </div>
              <div style={{ backgroundColor: 'var(--color-gold-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ color: 'var(--color-harvest-gold)', marginBottom: '0.25rem' }}>2. Mandi Intelligence</h4>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>Daily modal price tracking and arrivals intelligence helps farmers time market sales effectively.</p>
              </div>
              <div style={{ backgroundColor: '#F8EDE8', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ color: 'var(--color-terracotta)', marginBottom: '0.25rem' }}>3. Scheme Discovery</h4>
                <p style={{ fontSize: '0.88rem', margin: 0 }}>Demystified eligibility criteria and step-by-step document guidance for central and state schemes.</p>
              </div>
            </div>
          </div>

          {/* Architecture Card */}
          <div className="card" style={{ marginBottom: 'var(--space-2xl)', padding: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-forest-green)', marginBottom: '1rem' }}>
              System Architecture
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-forest-green)' }}>
                  <Cpu size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Frontend Architecture</h4>
                  <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--color-text-secondary)' }}>
                    Built with React, Vite, React Router, Recharts, and accessible Vanilla CSS design tokens. Engineered with an abstracted service layer ready to switch seamlessly between client mock mode and the FastAPI backend.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-harvest-gold)' }}>
                  <Database size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Backend & Machine Learning</h4>
                  <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--color-text-secondary)' }}>
                    Powered by FastAPI, MongoDB Atlas, and a Random Forest classification model for fraud-risk assessment based on cadastral plot area, precipitation anomalies, and historical claims frequency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/role-selection" className="btn btn-primary btn-lg">
              <span>Explore BKIG Portals</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
