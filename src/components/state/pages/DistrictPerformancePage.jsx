import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { api } from '../../../api';

export default function DistrictPerformancePage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('resolutionRate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDistrictPerformance()
      .then(data => setDistricts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sorted = [...districts]
    .filter(d => (d.name || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField] ?? 0;
      const valB = b[sortField] ?? 0;
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
            <option>Top Performers (&gt;80%)</option>
            <option>Needs Attention (&lt;70%)</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading district data...</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)' }}>
                  <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    District / Division {getSortIcon('name')}
                  </th>
                  <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('total')}>
                    Total {getSortIcon('total')}
                  </th>
                  <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('resolved')}>
                    Resolved {getSortIcon('resolved')}
                  </th>
                  <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'right' }} onClick={() => handleSort('escalated')}>
                    Escalated {getSortIcon('escalated')}
                  </th>
                  <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => handleSort('resolutionRate')}>
                    Performance {getSortIcon('resolutionRate')}
                  </th>
                  <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 && (
                  <tr><td colSpan="6" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No data yet. Submit a complaint to see district performance.</td></tr>
                )}
                {sorted.map((d, i) => {
                  const color = d.resolutionRate >= 80 ? 'var(--accent-green)' : d.resolutionRate >= 60 ? 'var(--accent-orange)' : 'var(--accent-red)';
                  return (
                    <tr key={d.name} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
                            #{i + 1}
                          </div>
                          {d.name}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 500 }}>{d.total}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', color: 'var(--accent-green)', fontWeight: 600 }}>{d.resolved}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', color: d.escalated > 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{d.escalated}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ flex: 1, height: 8, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${d.resolutionRate}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, width: 40, textAlign: 'right', color }}>{d.resolutionRate}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        {d.resolutionRate >= 70
                          ? <ArrowUpRight size={18} color="var(--accent-green)" />
                          : <ArrowDownRight size={18} color="var(--accent-red)" />
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
