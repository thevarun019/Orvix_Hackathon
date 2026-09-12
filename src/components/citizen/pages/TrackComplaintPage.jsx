import { useState } from 'react';
import { Search, MapPin, Building, Clock, AlertTriangle, MessageSquare, Phone } from 'lucide-react';
import { COMPLAINTS, statusLabel, typeIcon, slaLabel, typeColor } from '../../../data/mockData';

export default function TrackComplaintPage() {
  const [searchId, setSearchId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setLoading(true);
    setError('');
    
    // Simulate network delay
    setTimeout(() => {
      const found = COMPLAINTS.find(c => c.id.toUpperCase() === searchId.trim().toUpperCase());
      if (found) {
        setComplaint(found);
      } else {
        setComplaint(null);
        setError('Complaint ID not found. Please check and try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>🔎 Track Complaint</h2>
        <p style={{ color: 'var(--text-muted)' }}>Enter your Complaint ID to get real-time updates</p>
      </div>

      <div className="card" style={{ padding: '24px 32px', marginBottom: 24 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: 44, height: 48, fontSize: 16 }}
              placeholder="e.g. RW-00124"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: 48, padding: '0 32px' }} disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--accent-red)', fontSize: 13, marginTop: 12, textAlign: 'center' }}>{error}</p>}
      </div>

      {complaint && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-blue)' }}>{complaint.id}</h3>
                <span className={`badge ${complaint.status === 'progress' ? 'progress' : complaint.status}`}>{statusLabel[complaint.status]}</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {typeIcon(complaint.type)} {complaint.type} &nbsp;·&nbsp; {complaint.location}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Expected SLA</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: complaint.slaLeft === 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {slaLabel(complaint)}
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ padding: 32, gap: 40 }}>
            {/* Left: Timeline */}
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Complaint Timeline</h4>
              <div className="timeline">
                {complaint.timeline.map((s, i) => (
                  <div className="timeline-item" key={i}>
                    <div className={`timeline-dot ${s.status}`} />
                    <div className="timeline-content">
                      <h4 style={{ color: s.status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 14 }}>{s.label}</h4>
                      {s.time && <p style={{ fontSize: 12 }}>{s.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="ai-panel">
                <div className="ai-panel-header">📝 Authority Details</div>
                <div className="ai-row"><span className="lbl"><Building size={14}/> Department</span><span className="val">{complaint.authority}</span></div>
                {complaint.assignedTo && (
                  <div className="ai-row"><span className="lbl">👷 Assigned To</span><span className="val">{complaint.assignedTo}</span></div>
                )}
                <div className="ai-row"><span className="lbl"><Clock size={14}/> Submitted</span><span className="val">{complaint.submittedAt}</span></div>
              </div>

              {complaint.status === 'resolved' && complaint.afterImg && (
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>Repair Evidence</h4>
                  <img src={complaint.afterImg} alt="Repair Evidence" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }} />
                </div>
              )}
              
              {!complaint.afterImg && complaint.beforeImg && (
                <div>
                   <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>Uploaded Evidence</h4>
                  <img src={complaint.beforeImg} alt="Uploaded Evidence" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                 <button className="btn btn-secondary" style={{ flex: 1, gap: 8 }}><MessageSquare size={16}/> Add Comment</button>
                 <button className="btn btn-secondary" style={{ flex: 1, gap: 8 }}><Phone size={16}/> Contact Dept</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
