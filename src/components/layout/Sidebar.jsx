import { MapPin, Bell, LayoutDashboard, Plus, List, Navigation2, Users, BarChart3, FileText, Settings, Map, AlertTriangle, ClipboardList, Zap, Globe, TrendingUp } from 'lucide-react';

const NAV_CONFIG = {
  citizen: [
    { icon: <LayoutDashboard size={16}/>, label: 'Home',              id: 'home' },
    { icon: <Plus size={16}/>,           label: 'Report Road Problem', id: 'report' },
    { icon: <List size={16}/>,           label: 'My Complaints',       id: 'complaints' },
    { icon: <Navigation2 size={16}/>,    label: 'Track Complaint',     id: 'track' },
    { icon: <Bell size={16}/>,           label: 'Notifications',       id: 'notifications', badge: 3 },
    { icon: <Users size={16}/>,          label: 'Profile',             id: 'profile' },
    { icon: <Settings size={16}/>,       label: 'Settings',            id: 'settings' },
  ],
  authority: [
    { icon: <LayoutDashboard size={16}/>, label: 'Dashboard',         id: 'dashboard' },
    { icon: <ClipboardList size={16}/>,  label: 'Complaint Queue',    id: 'queue' },
    { icon: <Map size={16}/>,            label: 'GIS Map',            id: 'gismap' },
    { icon: <Users size={16}/>,          label: 'Assignments',        id: 'assignments' },
    { icon: <Zap size={16}/>,            label: 'All Insights',       id: 'insights' },
    { icon: <AlertTriangle size={16}/>,  label: 'Escalations',        id: 'escalations', badge: 5 },
    { icon: <Users size={16}/>,          label: 'Team Management',    id: 'team' },
    { icon: <BarChart3 size={16}/>,      label: 'Reports',            id: 'reports' },
    { icon: <Settings size={16}/>,       label: 'Settings',           id: 'settings' },
  ],
  state: [
    { icon: <Globe size={16}/>,          label: 'Overview',           id: 'overview' },
    { icon: <LayoutDashboard size={16}/>, label: 'District Performance',id: 'districts' },
    { icon: <Map size={16}/>,            label: 'State Map',          id: 'map' },
    { icon: <TrendingUp size={16}/>,     label: 'Trends & Analytics', id: 'trends' },
    { icon: <AlertTriangle size={16}/>,  label: 'SLA Analysis',       id: 'sla' },
    { icon: <FileText size={16}/>,       label: 'Public Reports',     id: 'public' },
    { icon: <Settings size={16}/>,       label: 'Settings',           id: 'settings' },
  ],
};

const USER_CONFIG = {
  citizen:   { name: 'Varun Bhardwaj', role: 'Citizen', color: '#3b82f6', initials: 'VB' },
  authority: { name: 'Ankit Sharma',   role: 'Authority Officer', color: '#8b5cf6', initials: 'AS' },
  state:     { name: 'State Gov.',     role: 'State Government', color: '#10b981', initials: 'SG' },
};

const TAGLINES = {
  citizen:   'Report • Track • Make a Difference',
  authority: 'Jaipur Municipal Corporation',
  state:     'Transparent Roads. Accountable Governance.',
};

export default function Sidebar({ activeDashboard, activeNav, onNavChange }) {
  const navItems = NAV_CONFIG[activeDashboard] || [];
  const user     = USER_CONFIG[activeDashboard];
  const tagline  = TAGLINES[activeDashboard];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">🛣️</div>
          <div className="logo-text">
            <h1>RoadWatch</h1>
            <p>Safe Roads, Stronger Communities</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item${activeNav === item.id ? ' active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Footer tagline */}
      <div style={{ padding: '8px 20px', fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>
        {tagline}
      </div>

      {/* User card */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar" style={{ background: user.color }}>
            {user.initials}
          </div>
          <div className="user-info">
            <div className="name">{user.name}</div>
            <div className="role">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
