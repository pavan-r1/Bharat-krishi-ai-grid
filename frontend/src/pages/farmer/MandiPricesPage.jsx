import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  RotateCcw, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  Layers,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import LoadingState from '../../components/common/LoadingState';
import mandiService from '../../services/mandiService';

export const MandiPricesPage = () => {
  const [crops, setCrops] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('Ragi (Finger Millet)');
  const [selectedState, setSelectedState] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [loading, setLoading] = useState(true);
  const [mandiData, setMandiData] = useState(null);
  const [dataError, setDataError] = useState('');

  // Load Initial Metadata
  useEffect(() => {
    async function initMetadata() {
      try {
      const [cropsList, statesList] = await Promise.all([
        mandiService.getCrops(),
        mandiService.getStates()
      ]);
      setCrops(cropsList);
      setStates(statesList);
      if (cropsList.length && !cropsList.includes(selectedCrop)) setSelectedCrop(cropsList[0]);
      } catch (err) { setDataError(err.message || 'Market directory is unavailable.'); }
    }
    initMetadata();
  }, []);

  // Fetch prices on filter changes
  useEffect(() => {
    async function fetchPrices() {
      setLoading(true);
      try {
        const data = await mandiService.getCommodityPrices(selectedCrop, {
          state: selectedState,
          search: searchKeyword
        });
        setMandiData(data);
        setDataError('');
      } catch (err) {
        setDataError(err.message || 'Market data is unavailable.');
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, [selectedCrop, selectedState, searchKeyword]);

  const handleReset = () => {
    setSelectedCrop('Ragi (Finger Millet)');
    setSelectedState('all');
    setSearchKeyword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--color-forest-green)' }}>
            Mandi Price Intelligence
          </h1>
          {mandiData?.dataStatus === 'snapshot' && <span style={{ padding: '4px 8px', borderRadius: '999px', background: 'var(--color-surface-white)', color: 'var(--color-text-secondary)', fontSize: '0.75rem', border: '1px solid var(--color-border)' }}>Dated market snapshot</span>}
        </div>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Compare market observations by commodity and region. The source and observation date are shown with the results.
        </p>
      </div>

      {dataError && <div role="status" className="card" style={{ borderColor: 'var(--color-harvest-gold)', color: 'var(--color-text-secondary)' }}>{dataError}</div>}
      {mandiData?.dataStatus === 'snapshot' && <div role="status" className="card" style={{ borderColor: 'var(--color-harvest-gold)', color: 'var(--color-text-secondary)' }}>
        Showing a dated AGMARKNET CSV snapshot, not live prices. Use the observation date and source below when comparing markets.
      </div>}

      {/* Filter Control Panel */}
      <div 
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          alignItems: 'end',
          padding: 'var(--space-lg)'
        }}
      >
        {/* Commodity Select */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="mandi-crop-select">
            Select Commodity
          </label>
          <select 
            id="mandi-crop-select" 
            className="form-select"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {crops.map((crop) => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="mandi-state-select">
            State / Region
          </label>
          <select 
            id="mandi-state-select" 
            className="form-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="all">All States</option>
            {states.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Search Markets */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="mandi-search-input">
            Search APMC Yard
          </label>
          <div className="input-with-icon">
            <Search size={16} className="input-icon-left" />
            <input 
              id="mandi-search-input"
              type="text" 
              className="form-input" 
              placeholder="e.g. Doddaballapur, Khanna..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* Reset Action */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleReset}
            style={{ width: '100%' }}
          >
            <RotateCcw size={15} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Aggregating mandi price records..." />
      ) : !mandiData || !mandiData.marketComparisons?.length ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          No market records are available for the selected filters. Check the data source and try another commodity or market.
        </div>
      ) : (
        <>
          {/* Price Summary Metric Cards */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-md)'
            }}
          >
            <div className="card" style={{ borderLeft: '4px solid var(--color-forest-green)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                MODAL PRICE (BENCHMARK)
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-forest-green)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {mandiData.summary.modalPrice == null ? '—' : `₹${mandiData.summary.modalPrice.toLocaleString('en-IN')}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', marginTop: '4px', color: mandiData.summary.trend === 'up' ? 'var(--color-status-success)' : 'var(--color-status-danger)' }}>
                {mandiData.summary.change7d !== 'Not available' && (mandiData.summary.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />)}
                <span>{mandiData.summary.change7d} vs prior week when available</span>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-terracotta)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                MINIMUM PRICE RECORDED
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {mandiData.summary.minPrice == null ? '—' : `₹${mandiData.summary.minPrice.toLocaleString('en-IN')}`}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Per Quintal (100 kg)
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-harvest-gold)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                MAXIMUM AUCTION PRICE
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {mandiData.summary.maxPrice == null ? '—' : `₹${mandiData.summary.maxPrice.toLocaleString('en-IN')}`}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Highest reported price
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                LATEST OBSERVATION
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-forest-green)', marginTop: '8px' }}>
                {mandiData.lastUpdated}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                <a href={mandiData.sourceUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{mandiData.source}</a>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'var(--space-xl)'
            }}
          >
            {/* Chart 1: 7-Day Modal Price Trend */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Recent Daily Price Movement</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    ₹ / Quintal daily modal rate
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', height: '280px', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mandiData.historicalTrend} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E0D5" />
                    <XAxis dataKey="date" stroke="#667168" fontSize={12} />
                    <YAxis stroke="#667168" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFDF7', borderColor: '#E4E0D5', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val) => [`₹${val}`, 'Price']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Line type="monotone" dataKey="modal" name="Modal Price" stroke="#173F2A" strokeWidth={3} dot={{ r: 4, fill: '#173F2A' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="max" name="Max Auction" stroke="#D6A84F" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="min" name="Min Auction" stroke="#A64B2A" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Regional Market Comparison */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Cross-Mandi Price Comparison</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Comparative modal rates across APMCs
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', height: '280px', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mandiData.marketComparisons} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E0D5" />
                    <XAxis 
                      dataKey="market" 
                      stroke="#667168" 
                      fontSize={10} 
                      angle={-15} 
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis stroke="#667168" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFDF7', borderColor: '#E4E0D5', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val) => [`₹${val}/Qtl`, 'Modal Rate']}
                    />
                    <Bar dataKey="modalPrice" name="Modal Price (₹)" fill="#2A6F4E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Market Comparison Data Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-white)' }}>
              <h3 className="card-title">Regional Mandi Directory & Daily Arrivals</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Showing verified agricultural produce market committees for {selectedCrop}
              </span>
            </div>

            <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>APMC Market Yard</th>
                    <th>District</th>
                    <th>State</th>
                    <th>Arrivals (Tonnes)</th>
                    <th>Min Price</th>
                    <th>Max Price</th>
                    <th>Modal Price</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiData.marketComparisons.map((m, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong style={{ color: 'var(--color-forest-green)' }}>{m.market}</strong>
                        {m.recordSource && <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                          Source: {m.recordSourceUrl ? <a href={m.recordSourceUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{m.recordSource.split(';')[0]}</a> : m.recordSource}
                        </div>}
                      </td>
                      <td>{m.district}</td>
                      <td>{m.state}</td>
                      <td>{m.arrivalsTonnes == null ? '—' : `${m.arrivalsTonnes} T`}</td>
                      <td>{m.minPrice == null ? '—' : `₹${m.minPrice.toLocaleString('en-IN')}`}</td>
                      <td>{m.maxPrice == null ? '—' : `₹${m.maxPrice.toLocaleString('en-IN')}`}</td>
                      <td>
                        <strong style={{ color: 'var(--color-forest-green)' }}>
                          ₹{m.modalPrice.toLocaleString('en-IN')}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MandiPricesPage;
