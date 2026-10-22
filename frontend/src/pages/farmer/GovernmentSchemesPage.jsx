import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Layers, 
  X, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import LoadingState from '../../components/common/LoadingState';
import schemesService from '../../services/schemesService';

export const GovernmentSchemesPage = () => {
  const [categories, setCategories] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    async function loadSchemesData() {
      setLoading(true);
      try {
        const [cats, items] = await Promise.all([
          schemesService.getCategories(),
          schemesService.getSchemes({
            category: selectedCategory,
            search: searchKeyword
          })
        ]);
        setCategories(cats);
        setSchemes(items);
        setDataError('');
      } catch (err) {
        setDataError(err.message || 'Scheme directory is unavailable.');
      } finally {
        setLoading(false);
      }
    }
    loadSchemesData();
  }, [selectedCategory, searchKeyword]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-forest-green)' }}>
            Government Scheme Finder
          </h1>
          <span className="demo-pill">Verify current rules with the official source</span>
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Discover central and state agricultural welfare programs, machinery subsidies, and credit schemes.
        </p>
      </div>

      {dataError && <div role="status" className="card" style={{ borderColor: 'var(--color-harvest-gold)', color: 'var(--color-text-secondary)' }}>{dataError} Scheme rules and eligibility must be confirmed with the linked official authority.</div>}

      {/* Search and Category Filter Bar */}
      <div 
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          padding: 'var(--space-lg)'
        }}
      >
        {/* Search Bar */}
        <div className="input-with-icon" style={{ width: '100%' }}>
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by scheme name, benefits, or ministry keyword..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                backgroundColor: selectedCategory === cat ? 'var(--color-forest-green)' : 'var(--color-surface-white)',
                borderColor: selectedCategory === cat ? 'var(--color-forest-green)' : 'var(--color-border)',
                color: selectedCategory === cat ? 'var(--color-warm-cream)' : 'var(--color-text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <LoadingState message="Fetching government scheme directory..." />
      ) : schemes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          No agricultural schemes found matching your search.
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-lg)'
          }}
        >
          {schemes.map((scheme) => (
            <div 
              key={scheme.id}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'var(--space-xl)',
                backgroundColor: 'var(--color-warm-cream)',
                borderTop: '4px solid var(--color-forest-green)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                    {scheme.category}
                  </span>
                  {scheme.isPopular && (
                    <span className="demo-pill" style={{ backgroundColor: 'var(--color-gold-light)', color: 'var(--color-forest-green)', border: '1px solid var(--color-harvest-gold)' }}>
                      Popular
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-forest-green)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                  {scheme.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  {scheme.ministry}
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {scheme.summary}
                </p>

                {scheme.subsidyDetails && (
                  <div style={{ backgroundColor: 'var(--color-sage-light)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--color-forest-green)', marginBottom: '1.25rem' }}>
                    <strong>Subsidy:</strong> {scheme.subsidyDetails}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => setSelectedScheme(scheme)}
                >
                  <span>View Details & Guide</span>
                  <ArrowRight size={14} />
                </button>
                {scheme.officialUrl && (
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm btn-icon"
                    title="Open official government portal"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Scheme Modal */}
      {selectedScheme && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedScheme(null)}
        >
          <div 
            className="modal-content"
            style={{ maxWidth: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '6px' }}>{selectedScheme.category}</span>
                <h2 style={{ fontSize: '1.45rem', color: 'var(--color-forest-green)', margin: '4px 0 0 0' }}>
                  {selectedScheme.title}
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {selectedScheme.ministry}
                </span>
              </div>
              <button 
                type="button" 
                className="btn-icon" 
                onClick={() => setSelectedScheme(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {selectedScheme.summary}
            </p>

            {/* Eligibility Checklist */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-forest-green)', marginBottom: '0.65rem' }}>
                Eligibility Criteria
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedScheme.eligibility.map((el, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                    <CheckCircle2 size={16} color="var(--color-forest-green)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span>{el}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-forest-green)', marginBottom: '0.65rem' }}>
                Benefits & Coverage
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedScheme.benefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-harvest-gold)', marginTop: '8px', flexShrink: 0 }} />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-forest-green)', marginBottom: '0.65rem' }}>
                Required Documents Checklist
              </h4>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {selectedScheme.documents.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>

            {/* How to Apply Steps */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-forest-green)', marginBottom: '0.65rem' }}>
                Application Procedure
              </h4>
              <ol style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedScheme.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setSelectedScheme(null)}
              >
                Close
              </button>
              {selectedScheme.officialUrl && (
                <a
                  href={selectedScheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentSchemesPage;
