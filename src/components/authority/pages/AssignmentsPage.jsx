import { useState } from 'react';
import { WORKERS, COMPLAINTS, typeIcon, severityLabel } from '../../../data/mockData';
import { MapPin, Briefcase, Clock, ChevronRight } from 'lucide-react';

export default function AssignmentsPage() {
  const [selectedWorker, setSelectedWorker] = useState(WORKERS[0]);
  const unassigned = COMPLAINTS.filter(c => !c.assignedTo && c.status === 'pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>👷 Field Worker Assignments</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage teams, track workload, and assign pending complaints</p>
      </div>

      <div className="grid-col-2-1" style={{ gap: 24, alignItems: 'flex-start' }}>
        {/* Left: Workers List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Field Workers</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {WORKERS.map(w => (
              <div 
                key={w.id} 
                onClick={() => setSelectedWorker(w)}
                style={{ 
                  padding: '16px 20px', 
                  borderBottom: '1px solid var(--border)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: selectedWorker?.id === w.id ? 'rgba(59,130,246,0.08)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: w.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {w.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{w.role} • {w.zone}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: w.workload > 3 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    {w.workload} active
                  </div>
                  <div style={{ fontSize: 11, color: w.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                    {w.status === 'active' ? '● Online' : '○ Offline'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Assignment Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {selectedWorker && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedWorker.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedWorker.role} • {selectedWorker.zone}</p>
                </div>
                <span className="badge progress">{selectedWorker.workload} Active Tasks</span>
              </div>
              
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>Assign Pending Complaint</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {unassigned.slice(0, 3).map(c => (
                  <div key={c.id} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 2 }}>{c.id}</div>
                      <div style={{ fontSize: 12 }}>{typeIcon(c.type)} {c.type}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.location}</div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ padding: '6px 12px' }}>Assign</button>
                  </div>
                ))}
                {unassigned.length === 0 && (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    No pending complaints in this zone.
                  </div>
                )}
                {unassigned.length > 3 && (
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>View {unassigned.length - 3} more...</button>
                )}
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Zone Statistics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Workers</span>
                <strong>{WORKERS.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active on Field</span>
                <strong style={{ color: 'var(--accent-green)' }}>{WORKERS.filter(w=>w.status==='active').length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Pending Assignments</span>
                <strong style={{ color: 'var(--accent-orange)' }}>{unassigned.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
