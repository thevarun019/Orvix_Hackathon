import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage       from './pages/LoginPage';
import CitizenLayout   from './layouts/CitizenLayout';
import AuthorityLayout from './layouts/AuthorityLayout';
import StateLayout     from './layouts/StateLayout';

// Auth helpers
export const getAuth = () => {
  try {
    const raw = localStorage.getItem('rw_auth');
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Validate it has required fields
    if (!data?.role || !['citizen','authority','state'].includes(data.role)) {
      localStorage.removeItem('rw_auth');
      return null;
    }
    return data;
  } catch { 
    localStorage.removeItem('rw_auth');
    return null; 
  }
};
export const setAuth  = (data) => localStorage.setItem('rw_auth', JSON.stringify(data));
export const clearAuth = () => localStorage.removeItem('rw_auth');

// Logout page — clears auth and goes to login
function LogoutPage() {
  clearAuth();
  return <Navigate to="/" replace />;
}

// Protected route wrapper
function Protected({ role, children }) {
  const auth = getAuth();
  if (!auth) return <Navigate to="/" replace />;
  if (auth.role !== role) return <Navigate to={`/${auth.role}`} replace />;
  return children;
}

export default function App() {
  const [, forceUpdate] = useState(0);

  const handleLogin = () => forceUpdate(n => n + 1);
  const handleLogout = () => { clearAuth(); forceUpdate(n => n + 1); };

  const auth = getAuth();

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={
          auth
            ? <Navigate to={`/${auth.role}`} replace />
            : <LoginPage onLogin={handleLogin} />
        }
      />

      {/* Citizen Dashboard */}
      <Route
        path="/citizen/*"
        element={
          <Protected role="citizen">
            <CitizenLayout onLogout={handleLogout} />
          </Protected>
        }
      />

      {/* Authority Dashboard */}
      <Route
        path="/authority/*"
        element={
          <Protected role="authority">
            <AuthorityLayout onLogout={handleLogout} />
          </Protected>
        }
      />

      {/* State Dashboard */}
      <Route
        path="/state/*"
        element={
          <Protected role="state">
            <StateLayout onLogout={handleLogout} />
          </Protected>
        }
      />

      {/* Logout */}
      <Route path="/logout" element={<LogoutPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
