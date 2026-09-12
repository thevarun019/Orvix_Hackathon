import HomePage          from './pages/HomePage';
import ReportProblemPage from './pages/ReportProblemPage';
import MyComplaintsPage  from './pages/MyComplaintsPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage       from './pages/ProfilePage';
import SettingsPage      from './pages/SettingsPage';

export default function CitizenDashboard({ activeNav, onNavChange }) {
  const props = { onNavChange };
  switch (activeNav) {
    case 'report':        return <ReportProblemPage {...props} />;
    case 'complaints':    return <MyComplaintsPage  {...props} />;
    case 'track':         return <TrackComplaintPage {...props} />;
    case 'notifications': return <NotificationsPage  {...props} />;
    case 'profile':       return <ProfilePage        {...props} />;
    case 'settings':      return <SettingsPage        {...props} />;
    default:              return <HomePage            {...props} />;
  }
}
