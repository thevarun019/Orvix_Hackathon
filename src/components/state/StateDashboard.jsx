import { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  STATE_KPIs, DISTRICTS, TREND_DATA, DAMAGE_TYPES, PROBLEMATIC_ROADS
} from '../../data/mockData';
import KpiCard from '../shared/KpiCard';

// ===================== Custom Tooltip =====================
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

// ===================== Trend Charts =====================
function TrendCharts() {
  const [activeTab, setActiveTab] = useState('complaints');

  const comboData = TREND_DATA.months.map((m, i) => ({
    month: m,
    Complaints: TREND_DATA.complaints[i],
    Resolved:   TREND_DATA.resolved[i],
    'SLA Violations': TREND_DATA.slaViolations[i],
  }));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">📈 Trends & Analytics</div>
          <div className="card-subtitle">Jan – Aug 2026</div>
        </div>
        <div className="tab-row" style={{ borderBottom: 'none', marginBottom: 0 }}>
          {[['complaints','Complaints'],['resolution','Resolution Time'],['sla','SLA Violation Rate']].map(([k,l]) => (
            <button key={k} className={`tab-btn${activeTab === k ? ' active' : ''}`} onClick={() => setActiveTab(k)} style={{ padding: '4px 12px' }}>{l}</button>
          ))}
        </div>
      </div>

      {activeTab === 'complaints' && (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={comboData}>
            <defs>
              <linearGradient id="gcComplaints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gcResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Area type="monotone" dataKey="Complaints" stroke="#3b82f6" strokeWidth={2} fill="url(#gcComplaints)" />
            <Area type="monotone" dataKey="Resolved"   stroke="#10b981" strokeWidth={2} fill="url(#gcResolved)" />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {activeTab === 'resolution' && (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={[
            {month:'Jan',time:52},{month:'Feb',time:48},{month:'Mar',time:45},
            {month:'Apr',time:50},{month:'May',time:42},{month:'Jun',time:38},
            {month:'Jul',time:40},{month:'Aug',time:41},
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="h" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="time" name="Avg Resolution (hrs)" fill="#8b5cf6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {activeTab === 'sla' && (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={comboData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="SLA Violations" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ===================== Damage Donut =====================
function DamagePie() {
  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 14 }}>🔍 Most Common Damage Types</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie data={DAMAGE_TYPES} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
              dataKey="value" paddingAngle={3}>
              {DAMAGE_TYPES.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-legend" style={{ flex: 1 }}>
          {DAMAGE_TYPES.map(d => (
            <div className="donut-legend-item" key={d.label}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="donut-legend-dot" style={{ background: d.color }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.label}</span>
              </div>
              <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>{d.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== Problematic Roads =====================
function ProblematicRoads() {
  const max = PROBLEMATIC_ROADS[0].count;
  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 14 }}>🚧 Top 5 Problematic Areas</div>
      {PROBLEMATIC_ROADS.map((r, i) => (
        <div key={r.area} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>#{i+1}</span>
              <span>{r.area}</span>
            </span>
            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{r.count}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill red" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ===================== State Map =====================
function StateMap({ onDistrictClick }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const perfColor = (perf) =>
    perf >= 85 ? '#10b981' : perf >= 70 ? '#f59e0b' : '#ef4444';

  useEffect(() => {
    if (mapInstance.current) return;
    import('leaflet').then(L => {
      const map = L.map(mapRef.current, {
        center: [26.5, 74.5], zoom: 6,
        zoomControl: true, attributionControl: false,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 12 }).addTo(map);

      DISTRICTS.forEach(d => {
        const color = perfColor(d.perf);
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background:${color};
            color:white;
            padding:6px 10px;
            border-radius:20px;
            font-size:11px;
            font-weight:700;
            border:2px solid white;
            box-shadow:0 3px 10px rgba(0,0,0,0.5);
            white-space:nowrap;
          ">${d.name.split(' ')[0]} ${d.perf}%</div>`,
          iconSize: [80, 28], iconAnchor: [40, 14],
        });
        const marker = L.marker([d.lat, d.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="min-width:180px">
            <strong style="color:#3b82f6">${d.name}</strong><br/>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px">
              <div style="display:flex;justify-content:space-between;font-size:12px">
                <span style="color:#94a3b8">Complaints</span><strong>${d.complaints.toLocaleString()}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px">
                <span style="color:#94a3b8">Resolved</span><strong style="color:#10b981">${d.resolved.toLocaleString()}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px">
                <span style="color:#94a3b8">SLA Breaches</span><strong style="color:#ef4444">${d.slaBreach}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px">
                <span style="color:#94a3b8">Performance</span><strong style="color:${color}">${d.perf}%</strong>
              </div>
            </div>
          </div>
        `);
        marker.on('click', () => onDistrictClick(d));
      });

      mapInstance.current = map;
    });
    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, []);

  return <div ref={mapRef} className="map-container map-container-lg" />;
}

// ===================== District Performance Table =====================
function DistrictTable({ onSelect }) {
  const perfColor = (p) => p >= 85 ? 'var(--accent-green)' : p >= 70 ? 'var(--accent-yellow)' : 'var(--accent-red)';
  const perfEmoji = (p) => p >= 85 ? '🟢' : p >= 70 ? '🟡' : '🔴';

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div className="card-title">🏛️ District / Municipality Performance</div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Authority</th>
            <th>Complaints</th>
            <th>Resolved</th>
            <th>SLA Breaches</th>
            <th>SLA Rate</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          {DISTRICTS.map(d => (
            <tr key={d.name} onClick={() => onSelect(d)}>
              <td style={{ fontWeight: 600 }}>{d.name}</td>
              <td>{d.complaints.toLocaleString()}</td>
              <td style={{ color: 'var(--accent-green)' }}>{d.resolved.toLocaleString()}</td>
              <td style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{d.slaBreach}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{
                      width: `${d.perf}%`,
                      background: perfColor(d.perf),
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: perfColor(d.perf), fontWeight: 700, minWidth: 32 }}>{d.perf}%</span>
                </div>
              </td>
              <td>
                <span style={{ fontSize: 13 }}>{perfEmoji(d.perf)}</span>{' '}
                <span style={{ fontSize: 12, color: perfColor(d.perf), fontWeight: 700 }}>
                  {d.perf >= 85 ? 'Good' : d.perf >= 70 ? 'Average' : 'Poor'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===================== District Detail Modal =====================
function DistrictModal({ district, onClose }) {
  if (!district) return null;
  const pending = district.complaints - district.resolved;
  const slaRate = Math.round(((district.complaints - district.slaBreach) / district.complaints) * 100);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>📍 {district.name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="kpi-card blue">
              <div className="kpi-icon blue">📋</div>
              <div className="kpi-value">{district.complaints.toLocaleString()}</div>
              <div className="kpi-label">Total Complaints</div>
            </div>
            <div className="kpi-card green">
              <div className="kpi-icon green">✅</div>
              <div className="kpi-value">{district.resolved.toLocaleString()}</div>
              <div className="kpi-label">Resolved</div>
            </div>
            <div className="kpi-card orange">
              <div className="kpi-icon orange">⏳</div>
              <div className="kpi-value">{pending.toLocaleString()}</div>
              <div className="kpi-label">Pending</div>
            </div>
            <div className="kpi-card red">
              <div className="kpi-icon red">⚠️</div>
              <div className="kpi-value">{district.slaBreach}</div>
              <div className="kpi-label">SLA Breaches</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>SLA Compliance</span>
              <strong style={{ color: slaRate >= 85 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>{slaRate}%</strong>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div className="progress-fill" style={{ width: `${slaRate}%`, background: slaRate >= 85 ? 'var(--accent-green)' : 'var(--accent-yellow)' }} />
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="ai-row"><span className="lbl">Most Common Issue</span><span className="val">Potholes</span></div>
            <div className="ai-row"><span className="lbl">Most Affected Area</span><span className="val">Ward 18</span></div>
            <div className="ai-row"><span className="lbl">Overall Performance</span>
              <span className="val" style={{ color: district.perf >= 85 ? 'var(--accent-green)' : district.perf >= 70 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                {district.perf}%
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm">📄 View Full Report</button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ===================== Public Transparency Panel =====================
function PublicTransparency() {
  return (
    <div className="card">
      <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', marginBottom: 10 }}>
          🌐 RoadWatch Public Report
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>People. Roads. Progress.</div>
        {[
          ['Reports this month', '5,821'],
          ['Resolved', '4,992'],
          ['SLA compliance', '86%'],
        ].map(([l,v]) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontSize:12, color:'var(--text-secondary)' }}>{l}</span>
            <strong style={{ fontSize:13 }}>{v}</strong>
          </div>
        ))}
      </div>
      <div className="ai-row" style={{ marginBottom: 8 }}>
        <span className="lbl">Top Issue</span>
        <span className="val" style={{ color:'var(--accent-red)' }}>Potholes</span>
      </div>
      <div className="ai-row">
        <span className="lbl">Worst Affected Area</span>
        <span className="val">Ward 18</span>
      </div>
      <div style={{ marginTop: 14, padding: 10, background: 'rgba(16,185,129,0.08)', borderRadius: 8, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
        🔒 Note: This data is aggregated and does not contain any personal information. Citizens' phone numbers, faces, and vehicle plates are never exposed.
      </div>
    </div>
  );
}

// ===================== State Dashboard =====================
export default function StateDashboard() {
  const [selectedDistrict, setDistrict] = useState(null);
  const [view, setView]                 = useState('overview');

  return (
    <div>
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>State / Public Dashboard</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overall performance, transparency and insights across all authorities</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="filter-select">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
          <select className="filter-select">
            <option>Rajasthan</option>
            <option>Jaipur Division</option>
            <option>Jodhpur Division</option>
          </select>
          <div style={{ width: 34, height: 34, background: 'var(--accent-green)', borderRadius: '50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 13, fontWeight: 700, color: 'white' }}>
            SG
          </div>
        </div>
      </div>

      {/* State KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)', marginBottom: 20 }}>
        <div className="kpi-card blue" style={{ gridColumn: 'span 1' }}>
          <div className="kpi-icon blue">📋</div>
          <div className="kpi-value">{STATE_KPIs.total.toLocaleString()}</div>
          <div className="kpi-label">Total Reports</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-icon green">✅</div>
          <div className="kpi-value">{STATE_KPIs.resolved.toLocaleString()}</div>
          <div className="kpi-label">Resolved</div>
        </div>
        <div className="kpi-card orange">
          <div className="kpi-icon orange">⏳</div>
          <div className="kpi-value" style={{ color:'var(--accent-orange)' }}>{STATE_KPIs.pending.toLocaleString()}</div>
          <div className="kpi-label">Pending</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-icon red">⚠️</div>
          <div className="kpi-value" style={{ color:'var(--accent-red)' }}>{STATE_KPIs.violations.toLocaleString()}</div>
          <div className="kpi-label">SLA Violations</div>
        </div>
        <div className="kpi-card cyan">
          <div className="kpi-icon cyan">📊</div>
          <div className="kpi-value">{STATE_KPIs.resolutionRate}%</div>
          <div className="kpi-label">Resolution Rate</div>
          <div style={{ marginTop: 8 }}>
            <div className="progress-bar">
              <div className="progress-fill green" style={{ width: `${STATE_KPIs.resolutionRate}%` }} />
            </div>
          </div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-icon purple">⏱️</div>
          <div className="kpi-value">{STATE_KPIs.avgResolution} <span style={{ fontSize: 14 }}>hrs</span></div>
          <div className="kpi-label">Avg Resolution</div>
        </div>
      </div>

      {/* District Table */}
      <div style={{ marginBottom: 20 }}>
        <DistrictTable onSelect={setDistrict} />
        <button className="view-all-btn" style={{ marginTop: 10 }}>View All Districts →</button>
      </div>

      {/* State Map + Trends */}
      <div className="grid-col-2-1" style={{ gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="card-header">
            <div className="card-title">🗺️ State Map</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['🟢','Good'],['🟡','Average'],['🔴','Poor'],['Critical','#ef4444']].map(([e,l]) => (
                <span key={l} style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e} {l}</span>
              ))}
            </div>
          </div>
          <StateMap onDistrictClick={setDistrict} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <DamagePie />
          <ProblematicRoads />
        </div>
      </div>

      {/* Trends + Public */}
      <div className="grid-col-2-1" style={{ gap: 16 }}>
        <TrendCharts />
        <PublicTransparency />
      </div>

      {/* District Modal */}
      {selectedDistrict && <DistrictModal district={selectedDistrict} onClose={() => setDistrict(null)} />}
    </div>
  );
}
