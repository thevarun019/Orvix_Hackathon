import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, LayoutDashboard, Map, TrendingUp,
  AlertTriangle, FileText, Settings, LogOut, Search, Bell, Calendar, Filter,
} from 'lucide-react';
import StateDashboard from '../components/state/StateDashboard';
import { getAuth } from '../App';

const NAV = [
  { id: 'overview',   icon: <Globe size={16} />,          label: 'Overview' },
  { id: 'districts',  icon: <LayoutDashboard size={16} />, label: 'District Performance' },
  { id: 'map',        icon: <Map size={16} />,             label: 'State Map' },
  { id: 'trends',     icon: <TrendingUp size={16} />,      label: 'Trends & Analytics' },
  { id: 'sla',        icon: <AlertTriangle size={16} />,   label: 'SLA Analysis' },
  { id: 'public',     icon: <FileText size={16} />,        label: 'Public Reports' },
  { id: 'settings',   icon: <Settings size={16} />,        label: 'Settings' },
];

export default function StateLayout({ onLogout }) {
  const [activeNav, setActiveNav] = useState('overview');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => { onLogout(); navigate('/'); };

  return (
    <div className="app-layout">
      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">🛣️</div>
            <div className="logo-text">
              <h1>RoadWatch</h1>
              <p>Safe Roads, Stronger Communities</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '8px 20px', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Transparent Roads. Accountable Governance.
        </div>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar" style={{ background: '#10b981' }}>
              {auth?.initials || 'SG'}
            </div>
            <div className="user-info">
              <div className="name">{auth?.name || 'State Government'}</div>
              <div className="role">View Only</div>
            </div>
            <button
              title="Logout"
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h2>State / Public Dashboard</h2>
            <p>Overall performance, transparency and insights across all authorities</p>
          </div>
          <div className="topbar-right">
            <div className="icon-btn" title="Search">
              <Search size={15} />
            </div>
            <div className="icon-btn" title="Filter">
              <Filter size={15} />
            </div>
            <select style={{
              padding: '6px 10px', borderRadius: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
            <select style={{
              padding: '6px 10px', borderRadius: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
            }}>
              <option>Rajasthan</option>
              <option>Jaipur Division</option>
              <option>Jodhpur Division</option>
            </select>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '6px 12px',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#10b981', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white',
              }}>{auth?.initials || 'SG'}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{auth?.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>State Government • View Only</div>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <StateDashboard activeNav={activeNav} />
        </div>
      </main>
    </div>
  );
}
