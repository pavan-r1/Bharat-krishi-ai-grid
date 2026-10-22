import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export const NotFoundPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-ivory-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div 
        className="container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-3xl) var(--space-md)'
        }}
      >
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-sage-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-forest-green)',
          marginBottom: 'var(--space-lg)'
        }}>
          <Compass size={36} />
        </div>
        <h1 style={{ fontSize: '3rem', color: 'var(--color-forest-green)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
          Agricultural Plot Not Found
        </h2>
        <p style={{ maxWidth: '440px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
          The portal page or cadastral route you requested does not exist or has been relocated within the grid.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Homepage</span>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
