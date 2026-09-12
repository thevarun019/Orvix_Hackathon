import { severityLabel, statusLabel, slaLabel } from '../../data/mockData';

export default function StatusBadge({ type, value }) {
  if (type === 'severity') {
    const sevCls = { critical:'critical', high:'high', medium:'medium', low:'low' }[value] || 'medium';
    return <span className={`badge ${sevCls}`}>{severityLabel[value] || value}</span>;
  }
  if (type === 'status') {
    const cls = value === 'progress' ? 'progress' : value;
    return <span className={`badge ${cls}`}>{statusLabel[value]}</span>;
  }
  if (type === 'sla') {
    // Note: To use slaLabel correctly we need the whole complaint object, but the old code passed just a value.
    // We'll approximate for backward compatibility in AuthorityDashboard
    const cls = value === 0 ? 'breached' : value < 12 ? 'high' : 'low';
    const lbl = value === 0 ? 'Breached' : `${value}h left`;
    return <span className={`badge ${cls}`}>{lbl}</span>;
  }
  return null;
}
