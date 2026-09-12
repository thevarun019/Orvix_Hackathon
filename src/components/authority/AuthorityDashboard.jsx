import OverviewPage from './pages/OverviewPage';
import ComplaintQueuePage from './pages/ComplaintQueuePage';
import AssignmentsPage from './pages/AssignmentsPage';
import EscalationsPage from './pages/EscalationsPage';
import SettingsPage from '../citizen/pages/SettingsPage'; // Reuse settings

export default function AuthorityDashboard({ activeNav, onNavChange }) {
  const props = { onNavChange };
  switch (activeNav) {
    case 'queue':       return <ComplaintQueuePage {...props} />;
    case 'assignments': 
    case 'team':        return <AssignmentsPage {...props} />;
    case 'escalations': return <EscalationsPage {...props} />;
    case 'settings':    return <SettingsPage {...props} />;
    case 'gismap':      return <OverviewPage {...props} />;
    case 'insights':
    case 'reports':
      return (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', marginTop: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Coming Soon</h3>
          <p>The {activeNav === 'insights' ? 'Insights' : 'Reports'} module is currently under development.</p>
        </div>
      );
    default:            return <OverviewPage {...props} />;
  }
}

