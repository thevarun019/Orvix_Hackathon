import { useState } from 'react';
import { NOTIFICATIONS } from '../../../data/mockData';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'complaint', label: 'Complaints' },
  { key: 'sla', label: 'SLA' },
  { key: 'escalation', label: 'Escalations' },
  { key: 'system', label: 'System' },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.category === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🔔 Notifications</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Stay updated on your complaints and SLA alerts</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="tab-row" style={{ marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button key={f.key} className={`tab-btn${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p>No notifications in this category.</p>
          </div>
        ) : (
          filtered.map(n => (
            <div 
              key={n.id} 
              className="card" 
              style={{ 
                padding: '16px 20px', 
                display: 'flex', 
                gap: 16, 
                alignItems: 'flex-start',
                borderLeft: `4px solid ${n.color}`,
                background: n.read ? 'var(--bg-card)' : 'var(--bg-elevated)',
                cursor: 'pointer'
              }}
              onClick={() => markRead(n.id)}
            >
              <div style={{ fontSize: 24, background: `${n.color}20`, width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {n.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: n.read ? 'var(--text-primary)' : 'var(--text-primary)' }}>{n.title}</h4>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</p>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)', marginTop: 8 }} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
