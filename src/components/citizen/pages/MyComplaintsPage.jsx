import { useState } from 'react';
import { Search } from 'lucide-react';
import { getMyComplaints, typeIcon, typeColor, slaLabel, statusLabel } from '../../../data/mockData';

// Reuse the detail modal from HomePage via inline definition
function ComplaintDetailModal({ complaint, onClose }) {
  const [rating, setRating] = useState(0);
  if (!complaint) return null;
  const isResolved  = complaint.status === 'resolved';
  const isEscalated = complaint.status === 'escalated' || complaint.slaLeft === 0;
  const sevCls = { critical:'critical', high:'high', medium:'medium', low:'low' }[complaint.severity] || 'medium';
  const stsCls = complaint.status === 'progress' ? 'progress' : complaint.status;
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <h3>{complaint.id}</h3>
            <div style={{display:'flex',gap:8,marginTop:6}}>
              <span className={`badge ${sevCls}`}>{complaint.severity.charAt(0).toUpperCase()+complaint.severity.slice(1)} Severity</span>
              <span className={`badge ${stsCls}`}>{statusLabel[complaint.status]}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {isEscalated && (
            <div className="escalation-alert" style={{marginBottom:16}}>
              <div className="escalation-alert-icon">⚠️</div>
              <div><h4>SLA BREACHED</h4><p>Escalated to the next authority.</p></div>
            </div>
          )}
          <div className="grid-2" style={{gap:24}}>
            <div>
              {isResolved && complaint.afterImg ? (
                <div className="img-compare" style={{marginBottom:14}}>
                  <div className="img-compare-item"><img src={complaint.beforeImg} alt="before"/><span className="img-compare-label">Before</span></div>
                  <div className="img-compare-item"><img src={complaint.afterImg}  alt="after" /><span className="img-compare-label">After</span></div>
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
              <div style={{marginTop:20}}>
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

const FILTERS = [
  { key:'all',      label:'All' },
  { key:'pending',  label:'Pending' },
  { key:'progress', label:'In Progress' },
  { key:'resolved', label:'Resolved' },
  { key:'escalated',label:'Escalated' },
  { key:'breached', label:'SLA Breached' },
];

export default function MyComplaintsPage() {
  const all = getMyComplaints();
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = all.filter(c => {
    if (filter==='breached') return c.slaLeft===0 || c.status==='escalated';
    if (filter!=='all' && c.status!==filter) return false;
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.type.toLowerCase().includes(search.toLowerCase()) && !c.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: all.length,
    pending:  all.filter(c=>c.status==='pending').length,
    progress: all.filter(c=>c.status==='progress').length,
    resolved: all.filter(c=>c.status==='resolved').length,
    escalated:all.filter(c=>c.status==='escalated').length,
    breached: all.filter(c=>c.slaLeft===0||c.status==='escalated').length,
  };

  const stsCls = s => ({ pending:'pending', progress:'progress', resolved:'resolved', escalated:'escalated' }[s]||'pending');

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:700,marginBottom:4}}>📋 My Complaints</h2>
        <p style={{fontSize:13,color:'var(--text-muted)'}}>All road problems you have reported</p>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:20}}>
        {[
          {icon:'📋',label:'Total',  value:all.length,                                            color:'blue'},
          {icon:'🔄',label:'Active', value:all.filter(c=>c.status==='progress').length,           color:'orange'},
          {icon:'✅',label:'Resolved',value:all.filter(c=>c.status==='resolved').length,          color:'green'},
          {icon:'⚠️',label:'Breached',value:all.filter(c=>c.slaLeft===0||c.status==='escalated').length,color:'red'},
        ].map(k=>(
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{position:'relative',marginBottom:16}}>
        <Search size={15} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}} />
        <input className="form-input" style={{paddingLeft:40}}
          placeholder="Search by complaint ID, road, location..."
          value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {/* Filter Tabs */}
      <div className="tab-row" style={{marginBottom:16}}>
        {FILTERS.map(f=>(
          <button key={f.key} className={`tab-btn${filter===f.key?' active':''}`} onClick={()=>setFilter(f.key)}>
            {f.label}
            {counts[f.key]>0&&<span style={{marginLeft:5,background:'var(--bg-elevated)',padding:'1px 6px',borderRadius:10,fontSize:10,fontWeight:700}}>{counts[f.key]}</span>}
          </button>
        ))}
      </div>

      {/* Complaints Cards */}
      {filtered.length===0 ? (
        <div className="card" style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>
          <div style={{fontSize:48,marginBottom:12}}>🔍</div>
          <p>No complaints found for this filter.</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {filtered.map(c=>{
            const sla = slaLabel(c);
            const slaCol = sla==='Breached'?'var(--accent-red)':sla.includes('left')&&parseInt(sla)<12?'var(--accent-orange)':'var(--text-muted)';
            return (
              <div key={c.id} className="complaint-card" onClick={()=>setSelected(c)}>
                {c.beforeImg && (
                  <img src={c.beforeImg} alt="" style={{width:52,height:52,borderRadius:10,objectFit:'cover',flexShrink:0}} />
                )}
                {!c.beforeImg && (
                  <div className="complaint-card-icon" style={{background:`${typeColor(c.type)}20`}}>
                    {typeIcon(c.type)}
                  </div>
                )}
                <div className="complaint-card-info" style={{flex:1}}>
                  <div className="id">{c.id} • {c.submittedAt}</div>
                  <div className="type">{typeIcon(c.type)} {c.type}</div>
                  <div className="loc">📍 {c.location} &nbsp;·&nbsp; {c.ward}</div>
                  {c.assignedTo && <div style={{fontSize:11,color:'var(--accent-blue)',marginTop:2}}>👷 {c.assignedTo}</div>}
                </div>
                <div style={{textAlign:'right',flexShrink:0,display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
                  <span className={`badge ${stsCls(c.status)}`}>{statusLabel[c.status]}</span>
                  <span className={`badge ${c.severity==='critical'?'critical':c.severity==='high'?'high':c.severity==='medium'?'medium':'low'}`}>
                    {c.severity.charAt(0).toUpperCase()+c.severity.slice(1)}
                  </span>
                  <span style={{fontSize:11,color:slaCol,fontWeight:600}}>{sla}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && <ComplaintDetailModal complaint={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
