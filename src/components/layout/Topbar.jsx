import { Bell, Search } from 'lucide-react';

const TOPBAR_CONFIG = {
  citizen: {
    title: 'Hello Varun 👋',
    subtitle: "Here's what's happening with your road complaints",
    user: 'VB',
    color: '#3b82f6',
    name: 'Varun Bhardwaj',
    role: 'Citizen',
  },
  authority: {
    title: 'Municipal Road Department',
    subtitle: 'Jaipur Municipal Corporation',
    user: 'AS',
    color: '#8b5cf6',
    name: 'Ankit Sharma',
    role: 'Authority Officer',
  },
  state: {
    title: 'State / Public Dashboard',
    subtitle: 'Overall performance, transparency and insights across all authorities',
    user: 'SG',
    color: '#10b981',
    name: 'State Government',
    role: 'View Only',
  },
};

export default function Topbar({ activeDashboard }) {
  const cfg = TOPBAR_CONFIG[activeDashboard] || TOPBAR_CONFIG.citizen;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>{cfg.title}</h2>
        <p>{cfg.subtitle}</p>
      </div>
      <div className="topbar-right">
        <div className="icon-btn" title="Search">
          <Search size={15} />
        </div>
        <div className="icon-btn" title="Notifications">
          <Bell size={15} />
          <div className="notification-dot" />
        </div>
        {/* User chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '6px 12px', cursor: 'pointer'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: cfg.color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white'
          }}>
            {cfg.user}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{cfg.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{cfg.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
