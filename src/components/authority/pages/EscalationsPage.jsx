import { AlertTriangle, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { COMPLAINTS, severityLabel, typeIcon } from '../../../data/mockData';

export default function EscalationsPage() {
  const escalated = COMPLAINTS.filter(c => c.status === 'escalated' || c.slaLeft === 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--accent-red)' }}>🚨 Escalations & SLA Breaches</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>High-priority issues requiring immediate intervention</p>
        </div>
      </div>

      {escalated.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>No Active Escalations</h3>
          <p>All complaints are currently within their SLA timeframes.</p>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: 20 }}>
          {escalated.map(c => (
            <div key={c.id} className="card" style={{ padding: 24, borderTop: '4px solid var(--accent-red)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800 }}>{c.id}</h3>
                    <span className="badge critical">ESCALATED</span>
                  </div>
                  <div style={{ fontSize: 14 }}>{typeIcon(c.type)} {c.type}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {c.location}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Time since breach</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-red)' }}>{Math.abs(c.slaLeft || 0) + 12}h</div>
                </div>
              </div>
              
              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 8, color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                  <ShieldAlert size={16} style={{ color: 'var(--accent-orange)' }} />
                  <strong>Current Status:</strong> Passed to Senior Engineer
                </div>
                <div style={{ display: 'flex', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
                  <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                  <strong>Originally submitted:</strong> {c.submittedAt}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" style={{ flex: 1, background: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>
                  Take Urgent Action
                </button>
                <button className="btn btn-secondary">View History</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
