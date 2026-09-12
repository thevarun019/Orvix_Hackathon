import { useState } from 'react';
import { Search, Filter, MessageSquare, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { COMPLAINTS, severityLabel, statusLabel, typeIcon } from '../../../data/mockData';

export default function ComplaintQueuePage() {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = COMPLAINTS.filter(c => {
    if (filterSeverity !== 'all' && c.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getSeverityBadge = (severity) => {
    const cls = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' }[severity] || 'medium';
    return <span className={`badge ${cls}`}>{severityLabel[severity]}</span>;
  };

  const getStatusBadge = (status) => {
    const cls = status === 'progress' ? 'progress' : status;
    return <span className={`badge ${cls}`}>{statusLabel[status]}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>📋 Complaint Queue</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage and triage reported road issues</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" style={{ gap: 8 }}>
            <AlertTriangle size={14} /> Auto-Assign AI Priority
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            className="form-input" 
            style={{ paddingLeft: 40 }} 
            placeholder="Search by ID or Location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="var(--text-muted)" />
          <select className="form-select" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} style={{ width: 150 }}>
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 150 }}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1 }}>
        <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>ID & Details</th>
              <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>Severity (AI)</th>
              <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>Status</th>
              <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>Assigned To</th>
              <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>Time Elapsed</th>
              <th style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 4 }}>{c.id}</div>
                  <div style={{ fontSize: 13 }}>{typeIcon(c.type)} {c.type}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.location}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {getSeverityBadge(c.severity)}
                  {c.aiConfidence && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{c.aiConfidence}% match</div>}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {getStatusBadge(c.status)}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {c.assignedTo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                        {c.assignedTo.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span style={{ fontSize: 13 }}>{c.assignedTo}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                  )}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.slaLeft === 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    {c.slaLeft === 0 ? 'Breached' : c.slaLeft != null ? `${c.sla - c.slaLeft}h ago` : '-'}
                  </div>
                  {c.slaLeft != null && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SLA: {c.sla}h</div>}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>Review <ArrowRight size={14} style={{ marginLeft: 4 }} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                  No complaints found matching the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
