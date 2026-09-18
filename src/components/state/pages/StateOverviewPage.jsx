import { useState, useEffect } from 'react';
import { TREND_DATA, DAMAGE_TYPES } from '../../../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText, CheckCircle, AlertTriangle, Download, Loader } from 'lucide-react';
import { api } from '../../../api';

export default function StateOverviewPage() {
  const [kpis, setKpis] = useState({ total: 0, resolved: 0, resolutionRate: 0, escalated: 0, inProgress: 0, avgResolutionHours: 0 });
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.getStateKPIs()
      .then(data => setKpis(data))
      .catch(err => console.error(err))
      .finally(() => setLoadingKpis(false));
  }, []);

  // Export Report: generates CSV and triggers browser download
  const handleExport = async () => {
    setExporting(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const csvContent = [
        ['Metric', 'Value'],
        ['Total Complaints', kpis.total],
        ['Resolved', kpis.resolved],
        ['Resolution Rate', `${kpis.resolutionRate}%`],
        ['Active Escalations', kpis.escalated],
        ['In Progress', kpis.inProgress ?? '-'],
        ['Avg Resolution (hrs)', kpis.avgResolutionHours ?? '-']
      ].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RoadWatch_State_Report_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const trendData = TREND_DATA.months.map((m, i) => ({
    month: m,
    Complaints: TREND_DATA.complaints[i],
    Resolved: TREND_DATA.resolved[i],
    'SLA Violations': TREND_DATA.slaViolations[i]
  }));

  const formatNumber = (num) => (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header with Export Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>📊 State Overview</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Real-time state-wide road maintenance analytics</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleExport}
          disabled={exporting}
          style={{ gap: 8, opacity: exporting ? 0.7 : 1, transition: 'opacity 0.2s' }}
        >
          {exporting
            ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
            : <><Download size={14} /> Export Report</>
          }
        </button>
      </div>

      {/* Top KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Complaints', value: loadingKpis ? '...' : formatNumber(kpis.total), icon: <FileText />, color: 'blue' },
          { label: 'Total Resolved', value: loadingKpis ? '...' : formatNumber(kpis.resolved), icon: <CheckCircle />, color: 'green' },
          { label: 'Resolution Rate', value: loadingKpis ? '...' : `${kpis.resolutionRate}%`, icon: <TrendingUp />, color: 'green' },
          { label: 'Active Escalations', value: loadingKpis ? '...' : formatNumber(kpis.escalated), icon: <AlertTriangle />, color: 'red' },
        ].map(kpi => (
          <div key={kpi.label} className={`kpi-card ${kpi.color}`}>
            <div className={`kpi-icon ${kpi.color}`}>{kpi.icon}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-col-2-1" style={{ gap: 24, alignItems: 'stretch' }}>
        {/* Left: Trend Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>State-wide Complaint Trends (YTD)</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Comparison of newly reported issues versus resolutions</p>
          <div style={{ flex: 1, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={formatNumber} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} itemStyle={{ fontSize: 13, fontWeight: 600 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                <Area type="monotone" dataKey="Complaints" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorComplaints)" />
                <Area type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Damage Types Donut */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Damage Categorization</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>AI classification of reported issues</p>
          <div style={{ flex: 1, minHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DAMAGE_TYPES} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {DAMAGE_TYPES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} itemStyle={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }} formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 16px', justifyContent: 'center', marginTop: 16 }}>
            {DAMAGE_TYPES.map(type => (
              <div key={type.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: type.color }} />
                {type.label} ({type.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Violations Bar Chart */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>SLA Breach Trends</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Monthly volume of complaints exceeding target resolution times</p>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <Tooltip cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="SLA Violations" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
