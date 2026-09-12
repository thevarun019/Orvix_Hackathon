import { MapPin } from 'lucide-react';

const DASHBOARDS = [
  { id: 'citizen',   icon: '👤', label: 'Citizen Dashboard' },
  { id: 'authority', icon: '🏢', label: 'Authority Dashboard' },
  { id: 'state',     icon: '🏛️', label: 'State / Public Dashboard' },
];

export default function DashboardSwitcher({ current, onChange }) {
  return (
    <div className="dashboard-switcher">
      {DASHBOARDS.map(d => (
        <button
          key={d.id}
          className={`dash-tab${current === d.id ? ' active' : ''}`}
          onClick={() => onChange(d.id)}
        >
          <span>{d.icon}</span>
          <span>{d.label}</span>
        </button>
      ))}
    </div>
  );
}
