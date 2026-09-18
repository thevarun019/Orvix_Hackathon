import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle, Loader } from 'lucide-react';
import { typeIcon } from '../../../data/mockData';
import { api } from '../../../api';

// Urgent Action Modal Component
function UrgentActionModal({ complaint, onClose, onAction }) {
  const [actionType, setActionType] = useState('dispatch');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.updateComplaintStatus(complaint.id, 'resolved', remarks || `Urgent action taken: ${actionType}`);
      setDone(true);
      setTimeout(() => { onAction(complaint.id); onClose(); }, 1500);
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease'
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480,
        border: '2px solid var(--accent-red)', boxShadow: '0 0 40px rgba(239,68,68,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <AlertTriangle size={22} color="var(--accent-red)" />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-red)' }}>Urgent Action — {complaint.id}</h3>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} color="var(--accent-green)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 700, color: 'var(--accent-green)' }}>Action recorded successfully!</p>
          </div>
        ) : (
          <>
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                🚨 This complaint has breached its SLA deadline. Select an action to take immediately.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Action Type</label>
              <select className="form-select" value={actionType} onChange={e => setActionType(e.target.value)}>
                <option value="dispatch">Dispatch Emergency Crew</option>
                <option value="escalate">Escalate to State Level</option>
                <option value="resolve">Mark as Resolved</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Remarks (optional)</label>
              <textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="Add notes about the action taken..." value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
                style={{ flex: 2, background: 'var(--accent-red)', borderColor: 'var(--accent-red)', gap: 8 }}
              >
                {submitting ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : '🚨 Confirm Action'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EscalationsPage() {
  const [escalated, setEscalated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // stores the complaint being actioned

  useEffect(() => {
    api.getAuthorityComplaints()
      .then(data => setEscalated(data.filter(c => c.status === 'escalated' || c.slaLeft === 0)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // After urgent action is confirmed, remove from list with a smooth transition
  const handleActionComplete = (complaintId) => {
    setEscalated(prev => prev.filter(c => c.id !== complaintId));
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading escalations...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {activeModal && (
        <UrgentActionModal
          complaint={activeModal}
          onClose={() => setActiveModal(null)}
          onAction={handleActionComplete}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--accent-red)' }}>🚨 Escalations &amp; SLA Breaches</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>High-priority issues requiring immediate intervention</p>
        </div>
        {escalated.length > 0 && (
          <span className="badge critical" style={{ fontSize: 14, padding: '6px 14px' }}>{escalated.length} Active</span>
        )}
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
                {/* Take Urgent Action: pulses red on hover, opens modal */}
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveModal(c)}
                  style={{
                    flex: 1,
                    background: 'var(--accent-red)',
                    borderColor: 'var(--accent-red)',
                    transition: 'transform 0.1s, box-shadow 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(239,68,68,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  🚨 Take Urgent Action
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
