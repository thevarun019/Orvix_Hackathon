import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '../App';

/* ─── Mock credentials ─────────────────────────────────── */
const USERS = [
  {
    email: 'citizen@roadwatch.in', password: 'citizen123',
    role: 'citizen', name: 'Varun Bhardwaj',
    initials: 'VB', color: '#3b82f6', org: 'Citizen — Jaipur',
  },
  {
    email: 'authority@roadwatch.in', password: 'auth123',
    role: 'authority', name: 'Ankit Sharma',
    initials: 'AS', color: '#8b5cf6', org: 'Jaipur Municipal Corporation',
  },
  {
    email: 'state@roadwatch.in', password: 'state123',
    role: 'state', name: 'State Government',
    initials: 'SG', color: '#10b981', org: 'Govt. of Rajasthan',
  },
];

const ROLE_CARDS = [
  {
    role: 'citizen',
    icon: '👤',
    title: 'Citizen',
    desc: 'Report road problems, track complaint status and get real-time SLA updates.',
    gradient: 'linear-gradient(135deg,#1e3a5f,#1a2744)',
    border: 'rgba(59,130,246,0.4)',
    accent: '#3b82f6',
    hint: 'citizen@roadwatch.in / citizen123',
  },
  {
    role: 'authority',
    icon: '🏢',
    title: 'Authority Officer',
    desc: 'Manage complaint queues, assign teams, update statuses and monitor SLA compliance.',
    gradient: 'linear-gradient(135deg,#2d1f5e,#1e1a3f)',
    border: 'rgba(139,92,246,0.4)',
    accent: '#8b5cf6',
    hint: 'authority@roadwatch.in / auth123',
  },
  {
    role: 'state',
    icon: '🏛️',
    title: 'State / Public',
    desc: 'Monitor system-wide KPIs, district performance, trend analytics and transparency reports.',
    gradient: 'linear-gradient(135deg,#0f3d30,#0a2922)',
    border: 'rgba(16,185,129,0.4)',
    accent: '#10b981',
    hint: 'state@roadwatch.in / state123',
  },
];

export default function LoginPage({ onLogin }) {
  const navigate    = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null); // pre-fill on card click

  const prefill = (card) => {
    const parts = card.hint.split(' / ');
    setEmail(parts[0]);
    setPassword(parts[1]);
    setSelected(card.role);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const user = USERS.find(u => u.email === email.trim() && u.password === password);
      if (user) {
        setAuth(user);
        onLogin();
        navigate(`/${user.role}`);
      } else {
        setError('Invalid email or password. Try one of the demo credentials below.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        top: -200, left: -200, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        bottom: -150, right: -100, pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          width: 68, height: 68, borderRadius: 18,
          background: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 18px',
          boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
        }}>🛣️</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, color: 'var(--text-primary)' }}>
          Road<span style={{ color: 'var(--accent-blue)' }}>Watch</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 6 }}>
          Safe Roads, Stronger Communities
        </p>
      </div>

      {/* Role Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 16, width: '100%', maxWidth: 860,
        marginBottom: 40,
      }}>
        {ROLE_CARDS.map(card => (
          <div key={card.role}
            onClick={() => prefill(card)}
            style={{
              background: card.gradient,
              border: `1.5px solid ${selected === card.role ? card.accent : card.border}`,
              borderRadius: 16, padding: '24px 20px',
              cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: selected === card.role ? `0 0 0 2px ${card.accent}40, 0 8px 24px rgba(0,0,0,0.3)` : '0 4px 16px rgba(0,0,0,0.2)',
              transform: selected === card.role ? 'translateY(-3px)' : 'none',
            }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              {card.title}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {card.desc}
            </p>
            {selected === card.role && (
              <div style={{
                marginTop: 12, padding: '6px 10px', borderRadius: 8,
                background: `${card.accent}20`, border: `1px solid ${card.accent}40`,
                fontSize: 11, color: card.accent, fontWeight: 600,
              }}>
                ✓ Selected — credentials pre-filled
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Login Form */}
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 20, padding: '32px 28px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Sign In</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          Select a role above or enter your credentials
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@roadwatch.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 14px', fontSize: 12,
              color: 'var(--accent-red)', marginBottom: 16,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ height: 46, fontSize: 15, marginTop: 4 }}
            disabled={loading}
          >
            {loading ? '⏳ Signing in...' : '→  Sign In to RoadWatch'}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
            Demo Credentials
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ROLE_CARDS.map(card => (
              <button key={card.role}
                type="button"
                onClick={() => prefill(card)}
                style={{
                  background: 'var(--bg-elevated)', border: `1px solid ${selected === card.role ? card.accent : 'var(--border)'}`,
                  borderRadius: 8, padding: '7px 12px', cursor: 'pointer', width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}>
                <span style={{ fontSize: 16 }}>{card.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: card.accent }}>{card.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{card.hint}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 28, textAlign: 'center' }}>
        RoadWatch — Smart Road Complaint Management Platform &nbsp;·&nbsp; Built for Orvix Hackathon 2026
      </p>
    </div>
  );
}
