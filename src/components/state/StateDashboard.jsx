import StateOverviewPage from './pages/StateOverviewPage';
import DistrictPerformancePage from './pages/DistrictPerformancePage';
import StateHeatmapPage from './pages/StateHeatmapPage';
import SettingsPage from '../citizen/pages/SettingsPage'; // Reuse settings

export default function StateDashboard({ activeNav, onNavChange }) {
  const props = { onNavChange };
  switch (activeNav) {
    case 'districts': return <DistrictPerformancePage {...props} />;
    case 'map':       return <StateHeatmapPage {...props} />;
    case 'settings':  return <SettingsPage {...props} />;
    case 'trends':
    case 'sla':
    case 'public':
      return (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', marginTop: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Coming Soon</h3>
          <p>This module is currently under development.</p>
        </div>
      );
    case 'overview':
    default:
      return <StateOverviewPage {...props} />;
  }
}
