import { useState } from 'react';

export default function KpiCard({ icon, label, value, color = 'blue', delta, deltaDir }) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className={`kpi-icon ${color}`}>{icon}</div>
      <div className="kpi-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="kpi-label">{label}</div>
      {delta && (
        <div className={`kpi-delta ${deltaDir || 'up'}`}>
          {deltaDir === 'down' ? '↓' : '↑'} {delta}
        </div>
      )}
    </div>
  );
}
