import { useState, useRef, useEffect } from 'react';
import { Camera, ChevronRight, MapPin, Bell, ArrowRight } from 'lucide-react';
import { getMyComplaints, typeIcon, typeColor, slaLabel, statusLabel, CURRENT_USER } from '../../../data/mockData';

// SLA Ring
function SlaRing({ hoursLeft, total, size = 110 }) {
  const r = size * 0.4;
  const circ = 2 * Math.PI * r;
  const pct = hoursLeft != null ? Math.max(0, hoursLeft / total) : 0;
  const color = hoursLeft === 0 ? '#ef4444' : hoursLeft < 8 ? '#f97316' : '#3b82f6';
  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 6px ${color}60)` }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={`${circ*pct} ${circ}`} />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: size*0.17, fontWeight: 800, color }}>{hoursLeft === 0 ? '⚠' : hoursLeft != null ? `${hoursLeft}h` : '✓'}</div>
        <div style={{ fontSize: size*0.09, color: 'var(--text-muted)' }}>{hoursLeft === 0 ? 'BREACH' : 'left'}</div>
      </div>
    </div>
  );
}

// Mini Map Widget
function MiniMapWidget({ complaints }) {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  useEffect(() => {
    let isMounted = true;
    import('leaflet').then(L => {
      if (!isMounted || !mapRef.current) return;
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }
      const map = L.map(mapRef.current, { center:[26.9,75.79], zoom:11, zoomControl:false, attributionControl:false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      complaints.filter(c=>c.lat).forEach(c => {
        const col = {critical:'#ef4444',high:'#f97316',medium:'#f59e0b',low:'#10b981',resolved:'#10b981'}[c.status==='resolved'?'resolved':c.severity]||'#3b82f6';
        L.circleMarker([c.lat,c.lng],{radius:8,fillColor:col,color:'white',weight:2,fillOpacity:0.9}).addTo(map)
          .bindPopup(`<strong style="color:#3b82f6">${c.id}</strong><br/>${c.type}`);
      });
      mapInst.current = map;
    });
    return () => { 
      isMounted = false;
      if (mapInst.current) {
        mapInst.current.remove();
        mapInst.current = null;
      } 
    };
  },[]);
  return <div ref={mapRef} style={{ height:220, borderRadius:12, overflow:'hidden', border:'1px solid var(--border)' }} />;
}

// Complaint Row
function ComplaintRow({ c, onClick }) {
  const sla = slaLabel(c);
  const slaCol = sla==='Breached'?'var(--accent-red)':sla.includes('left')&&parseInt(sla)<12?'var(--accent-orange)':'var(--text-muted)';
  const statusCls = {pending:'pending',progress:'progress',resolved:'resolved',escalated:'escalated'}[c.status]||'pending';
  return (
    <tr onClick={() => onClick(c)} style={{ cursor:'pointer' }}>
      <td style={{ color:'var(--accent-blue)', fontWeight:600 }}>{c.id}</td>
      <td><span style={{ fontSize:16 }}>{typeIcon(c.type)}</span> {c.type}</td>
      <td style={{ color:'var(--text-muted)', fontSize:12 }}>{c.ward}</td>
      <td><span className={`badge ${statusCls}`}>{statusLabel[c.status]}</span></td>
      <td style={{ color:slaCol, fontSize:12, fontWeight:600 }}>{sla}</td>
    </tr>
  );
}

// Complaint Detail Modal
function ComplaintDetailModal({ complaint, onClose }) {
  const [rating, setRating] = useState(0);
  if (!complaint) return null;
  const isEscalated = complaint.status==='escalated' || complaint.slaLeft===0;
  const isResolved  = complaint.status==='resolved';
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <h3>{complaint.id}</h3>
            <div style={{display:'flex',gap:8,marginTop:6}}>
              <span className={`badge ${complaint.severity==='critical'?'critical':complaint.severity==='high'?'high':complaint.severity==='medium'?'medium':'low'}`}>
                {complaint.severity.charAt(0).toUpperCase()+complaint.severity.slice(1)} Severity
              </span>
              <span className={`badge ${complaint.status==='progress'?'progress':complaint.status}`}>{statusLabel[complaint.status]}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {isEscalated && (
            <div className="escalation-alert" style={{marginBottom:16}}>
              <div className="escalation-alert-icon">⚠️</div>
              <div><h4>SLA BREACHED</h4><p>Automatically escalated to the next authority.</p></div>
            </div>
          )}
          <div className="grid-2" style={{gap:24}}>
            <div>
              {isResolved && complaint.afterImg ? (
                <div className="img-compare" style={{marginBottom:14}}>
                  <div className="img-compare-item"><img src={complaint.beforeImg} alt="before" /><span className="img-compare-label">Before</span></div>
                  <div className="img-compare-item"><img src={complaint.afterImg}  alt="after"  /><span className="img-compare-label">After</span></div>
                </div>
              ) : complaint.beforeImg ? (
                <img src={complaint.beforeImg} alt="complaint" style={{width:'100%',height:180,objectFit:'cover',borderRadius:10,marginBottom:14}} />
              ) : null}
              <div className="ai-panel">
                <div className="ai-panel-header">🤖 AI Analysis</div>
                <div className="ai-row"><span className="lbl">Damage</span><span className="val">{complaint.type}</span></div>
                <div className="ai-row"><span className="lbl">Confidence</span><span className="val ok">{complaint.aiConfidence}%</span></div>
                <div className="ai-row"><span className="lbl">Severity</span><span className="val warn">{complaint.severity.toUpperCase()}</span></div>
                {complaint.duplicateOf && <div className="ai-row"><span className="lbl">Possible Duplicate</span><span className="val">{complaint.duplicateOf} ({complaint.dupDistance})</span></div>}
              </div>
              <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:7}}>
                <div className="ai-row"><span className="lbl">📍 Location</span><span className="val">{complaint.location}</span></div>
                <div className="ai-row"><span className="lbl">🏢 Authority</span><span className="val">{complaint.authority}</span></div>
                <div className="ai-row"><span className="lbl">⏱ SLA</span><span className="val">{complaint.sla}h</span></div>
                <div className="ai-row"><span className="lbl">📅 Submitted</span><span className="val">{complaint.submittedAt}</span></div>
                {complaint.assignedTo && <div className="ai-row"><span className="lbl">👷 Assigned</span><span className="val">{complaint.assignedTo}</span></div>}
              </div>
              {complaint.slaLeft != null && !isResolved && (
                <div style={{marginTop:14,textAlign:'center'}}><SlaRing hoursLeft={complaint.slaLeft} total={complaint.sla} size={100} /></div>
              )}
              {isResolved && (
                <div style={{marginTop:14,textAlign:'center'}}>
                  <p style={{fontSize:13,color:'var(--text-secondary)',marginBottom:8}}>Rate the resolution</p>
                  <div className="stars" style={{justifyContent:'center'}}>
                    {[1,2,3,4,5].map(s=>(
                      <span key={s} className={`star${s<=rating?' lit':''}`} onClick={()=>setRating(s)}>★</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h4 style={{fontSize:13,fontWeight:700,marginBottom:14}}>📋 Timeline</h4>
              <div className="timeline">
                {complaint.timeline.map((s,i)=>(
                  <div className="timeline-item" key={i}>
                    <div className={`timeline-dot ${s.status}`} />
                    <div className="timeline-content">
                      <h4 style={{color:s.status==='pending'?'var(--text-muted)':'var(--text-primary)'}}>{s.label}</h4>
                      {s.time && <p>{s.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
              {complaint.comments?.length > 0 && (
                <div style={{marginTop:20}}>
                  <h4 style={{fontSize:13,fontWeight:700,marginBottom:10}}>💬 Comments</h4>
                  {complaint.comments.map((c,i)=>(
                    <div key={i} style={{background:'var(--bg-elevated)',borderRadius:8,padding:'10px 12px',marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:4}}>
                        <strong style={{color:'var(--accent-blue)'}}>{c.author}</strong>
                        <span style={{color:'var(--text-muted)'}}>{c.time}</span>
                      </div>
                      <p style={{fontSize:12,color:'var(--text-secondary)'}}>{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
              <div style={{marginTop:16}}>
                <p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>{complaint.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm">💬 Comment</button>
          <button className="btn btn-secondary btn-sm">📞 Contact</button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onNavChange }) {
  const complaints = getMyComplaints();
  const [selected, setSelected] = useState(null);
  const activeComplaint = complaints.find(c=>c.status==='progress'&&c.slaLeft!=null);
  const escalated       = complaints.filter(c=>c.status==='escalated'||c.slaLeft===0);

  return (
    <div>
      {/* KPI Cards */}
      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          {icon:'📋',label:'Total Complaints',value:complaints.length,color:'blue'},
          {icon:'🔄',label:'In Progress',value:complaints.filter(c=>c.status==='progress').length,color:'orange'},
          {icon:'✅',label:'Resolved',value:complaints.filter(c=>c.status==='resolved').length,color:'green'},
          {icon:'⚠️',label:'SLA Breached',value:escalated.length,color:'red'},
        ].map(k=>(
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Report Hero */}
      <div className="report-hero" onClick={()=>onNavChange('report')}>
        <div className="report-hero-icon"><Camera size={26} color="white" /></div>
        <div className="report-hero-text">
          <h3>Report Road Problem</h3>
          <p>Upload a photo, add location and get it fixed — AI-powered in seconds</p>
        </div>
        <ChevronRight size={20} color="rgba(255,255,255,0.4)" style={{marginLeft:'auto'}} />
      </div>

      <div className="grid-col-2-1" style={{gap:20}}>
        {/* Left: Recent Complaints */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {/* Complaints Table */}
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'16px 20px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--border)'}}>
              <div className="card-title">Recent Complaints</div>
              <button className="view-all-btn" onClick={()=>onNavChange('complaints')}>View All</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Problem</th><th>Ward</th><th>Status</th><th>SLA</th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0,5).map(c=>(
                  <ComplaintRow key={c.id} c={c} onClick={setSelected} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Map */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📍 My Complaint Locations</div>
              <button className="view-all-btn">Full Map</button>
            </div>
            <MiniMapWidget complaints={complaints} />
          </div>
        </div>

        {/* Right: SLA + Escalations + Quick Actions */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* SLA Countdown */}
          {activeComplaint && (
            <div className="card" style={{textAlign:'center'}}>
              <div className="card-title" style={{marginBottom:12}}>⏱ SLA Countdown</div>
              <SlaRing hoursLeft={activeComplaint.slaLeft} total={activeComplaint.sla} />
              <p style={{fontSize:12,color:'var(--text-muted)',marginTop:10}}>
                SLA: {activeComplaint.sla}h — {activeComplaint.id}
              </p>
              <button className="btn btn-secondary btn-sm" style={{marginTop:10,width:'100%'}}
                onClick={()=>setSelected(activeComplaint)}>
                View Details
              </button>
            </div>
          )}

          {/* Current Status */}
          <div className="card">
            <div className="card-title" style={{marginBottom:12}}>📊 Current Status</div>
            {[
              {label:'Active Complaints', val: complaints.filter(c=>c.status==='progress').length, col:'var(--accent-blue)'},
              {label:'Awaiting Assignment', val: complaints.filter(c=>c.status==='pending').length, col:'var(--accent-yellow)'},
              {label:'Resolved This Month', val: complaints.filter(c=>c.status==='resolved').length, col:'var(--accent-green)'},
              {label:'Escalated', val: escalated.length, col:'var(--accent-red)'},
            ].map(s=>(
              <div key={s.label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:13,color:'var(--text-secondary)'}}>{s.label}</span>
                <strong style={{color:s.col}}>{s.val}</strong>
              </div>
            ))}
          </div>

          {/* Escalation Alerts */}
          {escalated.length > 0 && (
            <div className="card">
              <div className="card-title" style={{marginBottom:10}}>🚨 Escalation Alerts</div>
              {escalated.map(c=>(
                <div className="escalation-alert" key={c.id} style={{marginBottom:8,cursor:'pointer'}} onClick={()=>setSelected(c)}>
                  <div className="escalation-alert-icon">⚠️</div>
                  <div>
                    <h4>SLA Breached — {c.id}</h4>
                    <p>{c.type} at {c.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="card">
            <div className="card-title" style={{marginBottom:12}}>⚡ Quick Actions</div>
            {[
              {icon:'📸',label:'Report New Problem',   nav:'report'},
              {icon:'📋',label:'View All Complaints',  nav:'complaints'},
              {icon:'🔎',label:'Track by Complaint ID',nav:'track'},
              {icon:'🔔',label:'View Notifications',   nav:'notifications'},
            ].map(a=>(
              <button key={a.nav} className="btn btn-secondary w-full"
                style={{justifyContent:'flex-start',gap:10,marginBottom:8}}
                onClick={()=>onNavChange(a.nav)}>
                <span>{a.icon}</span>{a.label}
                <ArrowRight size={12} style={{marginLeft:'auto',color:'var(--text-muted)'}} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && <ComplaintDetailModal complaint={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
