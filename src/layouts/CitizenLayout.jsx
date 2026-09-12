import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Plus, List, Navigation2, Bell,
  User, Settings, LogOut, Search,
} from 'lucide-react';
import CitizenDashboard from '../components/citizen/CitizenDashboard';
import { getAuth } from '../App';

const NAV = [
  { id: 'home',          icon: <LayoutDashboard size={16} />, label: 'Home' },
  { id: 'report',        icon: <Plus size={16} />,            label: 'Report Road Problem' },
  { id: 'complaints',    icon: <List size={16} />,            label: 'My Complaints' },
  { id: 'track',         icon: <Navigation2 size={16} />,     label: 'Track Complaint' },
  { id: 'notifications', icon: <Bell size={16} />,            label: 'Notifications', badge: 3 },
  { id: 'profile',       icon: <User size={16} />,            label: 'Profile' },
  { id: 'settings',      icon: <Settings size={16} />,        label: 'Settings' },
];

export default function CitizenLayout({ onLogout }) {
  const [activeNav, setActiveNav] = useState('home');
  const [showSearch, setShowSearch] = useState(false);
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
          Report • Track • Make a Difference
        </div>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar" style={{ background: '#3b82f6' }}>
              {auth?.initials || 'VB'}
            </div>
            <div className="user-info">
              <div className="name">{auth?.name || 'Citizen'}</div>
              <div className="role">Citizen</div>
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
            <h2>Hello {auth?.name?.split(' ')[0] || 'Varun'} 👋</h2>
            <p>Here's what's happening with your road complaints</p>
          </div>
          <div className="topbar-right">
            <div className="icon-btn" title="Search" onClick={() => setShowSearch(s => !s)}>
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
                background: '#3b82f6', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white',
              }}>{auth?.initials || 'VB'}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{auth?.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Citizen</div>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <CitizenDashboard activeNav={activeNav} onNavChange={setActiveNav} />
        </div>
      </main>
    </div>
  );
}
