import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Map, Users, Zap,
  AlertTriangle, BarChart3, Settings, LogOut, Search, Bell, Menu
} from 'lucide-react';
import AuthorityDashboard from '../components/authority/AuthorityDashboard';
import { getAuth } from '../App';

const NAV = [
  { id: 'dashboard',   icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { id: 'queue',       icon: <ClipboardList size={16} />,   label: 'Complaint Queue' },
  { id: 'gismap',      icon: <Map size={16} />,             label: 'GIS Map' },
  { id: 'assignments', icon: <Users size={16} />,           label: 'Assignments' },
  { id: 'insights',    icon: <Zap size={16} />,             label: 'All Insights' },
  { id: 'escalations', icon: <AlertTriangle size={16} />,   label: 'Escalations', badge: 5 },
  { id: 'team',        icon: <Users size={16} />,           label: 'Team Management' },
  { id: 'reports',     icon: <BarChart3 size={16} />,       label: 'Reports' },
  { id: 'settings',    icon: <Settings size={16} />,        label: 'Settings' },
];

export default function AuthorityLayout({ onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => { onLogout(); navigate('/'); };

  return (
    <div className="app-layout">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isSidebarOpen ? 'sidebar-open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* ─── Sidebar ─── */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
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
              onClick={() => { setActiveNav(item.id); setIsSidebarOpen(false); }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '8px 20px', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Jaipur Municipal Corporation
        </div>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar" style={{ background: '#8b5cf6' }}>
              {auth?.initials || 'AS'}
            </div>
            <div className="user-info">
              <div className="name">{auth?.name || 'Authority Officer'}</div>
              <div className="role">Authority Officer</div>
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
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center' }}>
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h2>Municipal Road Department</h2>
              <p className="hide-on-mobile">{auth?.org || 'Jaipur Municipal Corporation'}</p>
            </div>
          </div>
          <div className="topbar-right">
            <div className="icon-btn" title="Search">
              <Search size={15} />
            </div>
            <div className="icon-btn" title="Notifications">
              <Bell size={15} />
              <div className="notification-dot" />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '6px 12px',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#8b5cf6', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white',
              }}>{auth?.initials || 'AS'}</div>
              <div className="hide-on-mobile">
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{auth?.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Authority Officer</div>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <AuthorityDashboard activeNav={activeNav} onNavChange={setActiveNav} />
        </div>
      </main>
    </div>
  );
}
