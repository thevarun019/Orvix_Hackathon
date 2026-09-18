import { useState, useRef, useEffect } from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import { AUTHORITY_KPIs, RECENT_ACTIVITY, severityLabel, statusLabel, typeIcon, slaLabel } from '../../../data/mockData';
import { api } from '../../../api';

function AuthorityMap({ complaints }) {
  const mapRef = useRef(null);
  const mapInst = useRef(null);

  useEffect(() => {
    let isMounted = true;
    import('leaflet').then(L => {
      if (!isMounted || !mapRef.current) return;
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }
      const map = L.map(mapRef.current, { center: [26.9124, 75.7873], zoom: 12, attributionControl: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      complaints.filter(c => c.lat && c.lng).forEach(c => {
        const col = {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#f59e0b',
          low: '#10b981',
          resolved: '#3b82f6'
        }[c.status === 'resolved' ? 'resolved' : c.severity] || '#3b82f6';
        
        L.circleMarker([c.lat, c.lng], {
          radius: c.severity === 'critical' ? 12 : 8,
          fillColor: col,
          color: 'white',
          weight: 2,
          fillOpacity: 0.9
        }).addTo(map).bindPopup(`
          <div style="font-family:Inter,sans-serif;font-size:13px">
            <strong style="color:var(--text-primary);font-size:14px">${c.id}</strong><br/>
            <span style="color:var(--text-secondary)">${c.type}</span><br/>
            <span style="color:${col};font-weight:700;font-size:12px;text-transform:uppercase;margin-top:4px;display:inline-block">
              ${c.severity} Severity
            </span>
          </div>
        `);
      });

      mapInst.current = map;
    });

    return () => {
      isMounted = false;
      if (mapInst.current) {
        mapInst.current.remove();
        mapInst.current = null;
      }
    };
  }, [complaints]);

  return <div ref={mapRef} style={{ height: 400, borderRadius: 12, border: '1px solid var(--border)' }} />;
}

export default function OverviewPage({ onNavChange }) {
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [critical, setCritical] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuthorityComplaints()
      .then(data => {
        const active = data.filter(c => c.status !== 'resolved');
        setActiveComplaints(active);
        setCritical(data.filter(c => c.severity === 'critical' && c.status !== 'resolved'));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding:40, textAlign:'center'}}>Loading dashboard...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Row */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { icon: <AlertTriangle />, label: 'Active Complaints', value: AUTHORITY_KPIs.activeComplaints, color: 'blue' },
          { icon: <TrendingUp />, label: 'Critical / High Risk', value: AUTHORITY_KPIs.criticalIssues, color: 'red' },
          { icon: <Clock />, label: 'SLA Breached', value: AUTHORITY_KPIs.slaBreached, color: 'orange' },
          { icon: <CheckCircle />, label: 'Resolved This Week', value: AUTHORITY_KPIs.resolvedThisWeek, color: 'green' },
        ].map(k => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-col-2-1" style={{ gap: 24 }}>
        {/* Main Map */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>GIS Live Map</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Real-time spatial distribution of active road issues</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <select className="form-select" style={{ padding: '6px 12px', fontSize: 13 }}>
                <option>All Wards</option>
                <option>Ward 12</option>
                <option>Ward 8</option>
              </select>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <AuthorityMap complaints={activeComplaints} />
          </div>
        </div>

        {/* AI Triage Inbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Triage Inbox</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Critical issues requiring immediate attention</p>
              </div>
              <span className="badge critical">{critical.length}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {critical.slice(0, 4).map(c => (
                <div key={c.id} style={{ padding: 12, border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, background: 'rgba(239, 68, 68, 0.05)', display: 'flex', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                    {c.beforeImg ? (
                      <img src={c.beforeImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        {typeIcon(c.type)}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <strong style={{ fontSize: 14 }}>{c.id}</strong>
                      <span style={{ fontSize: 11, color: 'var(--accent-red)', fontWeight: 700 }}>{slaLabel(c)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.type}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>📍 {c.location}</div>
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary w-full" onClick={() => onNavChange('queue')} style={{ marginTop: 8 }}>
                View All in Queue
              </button>
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Activity</h3>
            <div className="timeline">
              {RECENT_ACTIVITY.map((a, i) => (
                <div className="timeline-item" key={i}>
                  <div className={`timeline-dot ${a.type === 'escalated' ? 'escalated' : a.type === 'resolved' ? 'resolved' : 'pending'}`} />
                  <div className="timeline-content">
                    <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>{a.text}</p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
