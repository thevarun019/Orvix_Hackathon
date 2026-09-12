import { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DISTRICTS } from '../../../data/mockData';

export default function DistrictPerformancePage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('perf');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sorted = [...DISTRICTS].filter(d => d.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🏢 District Performance Leaderboard</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Compare resolution rates and SLA compliance across divisions</p>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            className="form-input" 
            style={{ paddingLeft: 40 }} 
            placeholder="Search districts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="var(--text-muted)" />
          <select className="form-select" style={{ width: 180 }}>
            <option>All Divisions</option>
            <option>Top Performers ({'>'}80%)</option>
            <option>Needs Attention ({'<'}70%)</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
        <div className="table-responsive">
          <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)' }}>
                <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  District / Division {getSortIcon('name')}
                </th>
                <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('complaints')}>
                  Total Complaints {getSortIcon('complaints')}
                </th>
                <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('resolved')}>
                  Resolved {getSortIcon('resolved')}
                </th>
                <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('slaBreach')}>
                  SLA Breaches {getSortIcon('slaBreach')}
                </th>
                <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => handleSort('perf')}>
                  Performance Health {getSortIcon('perf')}
                </th>
                <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => (
                <tr key={d.name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
                        #{i + 1}
                      </div>
                      {d.name}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 500 }}>{d.complaints.toLocaleString()}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', color: 'var(--accent-green)', fontWeight: 600 }}>{d.resolved.toLocaleString()}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', color: d.slaBreach > 200 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{d.slaBreach.toLocaleString()}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 8, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${d.perf}%`, 
                          height: '100%', 
                          background: d.color === 'green' ? 'var(--accent-green)' : d.color === 'yellow' ? 'var(--accent-orange)' : 'var(--accent-red)',
                          borderRadius: 4
                        }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, width: 36, textAlign: 'right', color: d.color === 'green' ? 'var(--accent-green)' : d.color === 'yellow' ? 'var(--accent-orange)' : 'var(--accent-red)' }}>
                        {d.perf}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    {d.perf > 75 ? (
                      <ArrowUpRight size={18} color="var(--accent-green)" />
                    ) : (
                      <ArrowDownRight size={18} color="var(--accent-red)" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
