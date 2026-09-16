import { useState, useRef, useEffect } from 'react';
import { MapPin, Camera, Send, Upload, X, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { PROBLEM_TYPES } from '../../../data/mockData';
import { api } from '../../../api';

// Step indicator
function StepBar({ current, total }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:28 }}>
      {Array.from({length:total},(_,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',flex:1}}>
          <div style={{
            width:30,height:30,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
            background: i<current?'var(--accent-green)':i===current?'var(--accent-blue)':'var(--bg-elevated)',
            border: i===current?'2px solid var(--accent-blue)':'2px solid transparent',
            fontSize:12,fontWeight:700,color:'white',flexShrink:0,
            transition:'all 0.3s',
          }}>
            {i<current ? '✓' : i+1}
          </div>
          {i<total-1 && (
            <div style={{flex:1,height:2,background:i<current?'var(--accent-green)':'var(--bg-elevated)',transition:'background 0.3s'}} />
          )}
        </div>
      ))}
    </div>
  );
}

// Step labels
const STEP_LABELS = ['Select Problem','Upload Evidence','Location','AI Analysis','Details','Review','✅ Done'];

// Map for Step 3
function LocationStep({ location, setLocation }) {
  const mapRef  = useRef(null);
  const mapInst = useRef(null);
  const marker  = useRef(null);

  useEffect(() => {
    let isMounted = true;
    import('leaflet').then(L => {
      if (!isMounted || !mapRef.current) return;
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }
      const map = L.map(mapRef.current, { center:[26.912,75.790], zoom:14, attributionControl:false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      const mk = L.marker([26.912,75.790], { draggable:true }).addTo(map);
      marker.current = mk;
      setLocation({ lat:26.912, lng:75.790, address:'MG Road, Ward 12, Jaipur' });

      mk.on('dragend', () => {
        const pos = mk.getLatLng();
        setLocation({ lat:pos.lat, lng:pos.lng, address:`Near ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` });
      });

      map.on('click', (e) => {
        mk.setLatLng(e.latlng);
        setLocation({ lat:e.latlng.lat, lng:e.latlng.lng, address:`Near ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}` });
      });

      mapInst.current = map;
    });
    return () => { 
      isMounted = false;
      if(mapInst.current){mapInst.current.remove();mapInst.current=null;} 
    };
  },[]);

  return (
    <div>
      <div style={{marginBottom:12,padding:'10px 14px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:10,fontSize:13,color:'var(--text-secondary)'}}>
        📍 <strong style={{color:'var(--accent-blue)'}}>Click on the map</strong> or drag the pin to pinpoint the exact location
      </div>
      <div ref={mapRef} style={{height:280,borderRadius:12,overflow:'hidden',border:'1px solid var(--border)',marginBottom:14}} />
      <div className="form-group">
        <label className="form-label">Location / Address</label>
        <input className="form-input" value={location?.address||''} onChange={e=>setLocation(l=>({...l,address:e.target.value}))} placeholder="e.g. MG Road, near Statue Circle, Ward 12" />
      </div>
      <div className="grid-2" style={{gap:12}}>
        <div className="form-group">
          <label className="form-label">Ward</label>
          <select className="form-select">
            <option>Ward 12</option>
            {Array.from({length:20},(_,i)=><option key={i+1}>Ward {i+1}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Road / Area</label>
          <input className="form-input" placeholder="e.g. MG Road" />
        </div>
      </div>
      <button className="btn btn-secondary w-full" style={{gap:8}}>
        <MapPin size={14} style={{color:'var(--accent-blue)'}} /> Use My GPS Location
      </button>
    </div>
  );
}

// AI Analysis Step
function AiAnalysisStep({ problemType, images }) {
  const [progress, setProgress] = useState(0);
  const done = progress >= 100;

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(p+4,100)), 60);
    return () => clearInterval(t);
  },[]);

  const pt = PROBLEM_TYPES.find(p=>p.id===problemType)||PROBLEM_TYPES[0];

  return (
    <div>
      {!done ? (
        <div style={{textAlign:'center',padding:'32px 0'}}>
          <div style={{fontSize:48,marginBottom:16,animation:'pulse 1s infinite'}}>🤖</div>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>Analyzing Road Damage...</h3>
          <p style={{color:'var(--text-muted)',fontSize:13,marginBottom:24}}>AI is processing your image for damage classification</p>
          <div className="progress-bar" style={{height:8,maxWidth:300,margin:'0 auto'}}>
            <div className="progress-fill blue" style={{width:`${progress}%`,transition:'width 0.1s'}} />
          </div>
          <p style={{fontSize:12,color:'var(--accent-blue)',marginTop:8}}>{progress}%</p>
        </div>
      ) : (
        <div>
          <div style={{textAlign:'center',marginBottom:20}}>
            <div style={{fontSize:40,marginBottom:8}}>✅</div>
            <h3 style={{fontSize:18,fontWeight:700}}>AI Analysis Complete</h3>
          </div>
          <div className="ai-panel" style={{marginBottom:14}}>
            <div className="ai-panel-header">🤖 AI ROAD ANALYSIS</div>
            <div className="ai-row"><span className="lbl">Detected Damage</span><span className="val" style={{color:pt.color}}>{pt.icon} {pt.label}</span></div>
            <div className="ai-row"><span className="lbl">Confidence</span><span className="val ok">94%</span></div>
            <div className="ai-row"><span className="lbl">Severity</span><span className="val warn">HIGH</span></div>
            <div className="ai-row"><span className="lbl">Estimated Road Risk</span><span className="val warn">High</span></div>
            <div className="ai-row"><span className="lbl">Possible Duplicate</span><span className="val">RW-00119 (37m away)</span></div>
          </div>
          <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:'12px 16px',marginBottom:14}}>
            <div style={{fontWeight:700,color:'var(--accent-orange)',fontSize:13,marginBottom:4}}>⚠ Priority Recommendation</div>
            <p style={{fontSize:12,color:'var(--text-secondary)'}}>This damage is classified as HIGH priority. Expected SLA: 24 hours. The responsible authority will be notified immediately.</p>
          </div>
          {images.length > 0 && (
            <img src={images[0]} alt="analyzed" style={{width:'100%',height:140,objectFit:'cover',borderRadius:10,border:'2px solid var(--accent-blue)'}} />
          )}
        </div>
      )}
    </div>
  );
}

// Review & Submit Step
function ReviewStep({ data }) {
  return (
    <div>
      <div style={{marginBottom:20,textAlign:'center'}}>
        <div style={{fontSize:36,marginBottom:8}}>📋</div>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Review Your Complaint</h3>
        <p style={{fontSize:13,color:'var(--text-muted)'}}>Please verify all details before submitting</p>
      </div>
      <div className="ai-panel">
        <div className="ai-panel-header">📋 Complaint Summary</div>
        <div className="ai-row"><span className="lbl">Problem Type</span><span className="val">{PROBLEM_TYPES.find(p=>p.id===data.problemType)?.label||'Not selected'}</span></div>
        <div className="ai-row"><span className="lbl">Location</span><span className="val">{data.location?.address||'Not set'}</span></div>
        <div className="ai-row"><span className="lbl">Photos</span><span className="val ok">{data.images.length} uploaded</span></div>
        <div className="ai-row"><span className="lbl">AI Severity</span><span className="val warn">HIGH</span></div>
        <div className="ai-row"><span className="lbl">Expected SLA</span><span className="val">24 hours</span></div>
        <div className="ai-row"><span className="lbl">Authority</span><span className="val">Road Maintenance Dept.</span></div>
      </div>
      {data.description && (
        <div style={{marginTop:14,padding:'12px 14px',background:'var(--bg-elevated)',borderRadius:10}}>
          <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.5px'}}>Description</p>
          <p style={{fontSize:13,color:'var(--text-secondary)'}}>{data.description}</p>
        </div>
      )}
      {data.images.length > 0 && (
        <div style={{marginTop:14}}>
          <p style={{fontSize:11,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Evidence Photos</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {data.images.map((img,i)=>(
              <img key={i} src={img} alt="" style={{width:70,height:70,objectFit:'cover',borderRadius:8,border:'1px solid var(--border)'}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Success Step
function SuccessStep({ complaintId, onNavChange }) {
  return (
    <div style={{textAlign:'center',padding:'20px 0'}}>
      <div style={{
        width:80,height:80,borderRadius:'50%',background:'rgba(16,185,129,0.15)',
        border:'3px solid var(--accent-green)',display:'flex',alignItems:'center',justifyContent:'center',
        fontSize:36,margin:'0 auto 20px',
      }}>✅</div>
      <h2 style={{fontSize:24,fontWeight:800,color:'var(--accent-green)',marginBottom:8}}>Complaint Submitted!</h2>
      <p style={{color:'var(--text-secondary)',fontSize:14,marginBottom:24}}>Your road problem has been reported successfully. We'll keep you updated.</p>

      <div className="ai-panel" style={{textAlign:'left',marginBottom:20}}>
        <div className="ai-panel-header">📋 Submission Details</div>
        <div className="ai-row"><span className="lbl">Complaint ID</span><span className="val" style={{color:'var(--accent-blue)',fontSize:16,fontWeight:800}}>{complaintId}</span></div>
        <div className="ai-row"><span className="lbl">Expected Response</span><span className="val">Within 24 hours</span></div>
        <div className="ai-row"><span className="lbl">AI Status</span><span className="val ok">✓ Verified</span></div>
        <div className="ai-row"><span className="lbl">Authority Notified</span><span className="val ok">✓ Road Maintenance Dept.</span></div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <button className="btn btn-primary" onClick={()=>onNavChange('track')} style={{height:44}}>
          🔎 Track This Complaint
        </button>
        <button className="btn btn-secondary" onClick={()=>onNavChange('complaints')} style={{height:44}}>
          📋 View My Complaints
        </button>
        <button className="btn btn-secondary" onClick={()=>onNavChange('home')} style={{height:44}}>
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}

export default function ReportProblemPage({ onNavChange }) {
  const [step, setStep]               = useState(0);
  const [problemType, setProblemType] = useState('');
  const [images, setImages]           = useState([]);
  const [location, setLocation]       = useState(null);
  const [description, setDescription] = useState('');
  const [additionalNotes, setNotes]   = useState('');
  const [complaintId, setComplaintId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setImages(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Find problem type label
      const pt = PROBLEM_TYPES.find(p=>p.id===problemType);
      
      const payload = {
        title: pt ? pt.label : 'Road Issue',
        description: description || additionalNotes,
        latitude: location?.lat || 26.912,
        longitude: location?.lng || 75.790,
        address: location?.address || 'Unknown Location',
        damageType: problemType,
        severity: 0.9, // HARDCODED for MVP based on AI analysis
        authorityId: null // backend handles assignment
      };
      
      const res = await api.submitComplaint(payload);
      setComplaintId(res.ticketNumber || res.id);
      setStep(6);
    } catch (err) {
      alert('Failed to submit complaint: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canNext = () => {
    if (step===0) return !!problemType;
    if (step===1) return images.length > 0;
    if (step===2) return !!location;
    return true;
  };

  const data = { problemType, images, location, description, additionalNotes };
  const pt   = PROBLEM_TYPES.find(p=>p.id===problemType);

  return (
    <div style={{maxWidth:700,margin:'0 auto'}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>📸 Report Road Problem</h2>
        <p style={{fontSize:13,color:'var(--text-muted)'}}>
          Step {Math.min(step+1,7)} of 7 — {STEP_LABELS[step]}
        </p>
      </div>

      <StepBar current={step} total={7} />

      <div className="card">
        {/* ── Step 0: Select Problem ── */}
        {step===0 && (
          <div>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>What type of road problem are you reporting?</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
              {PROBLEM_TYPES.map(p=>(
                <div key={p.id}
                  onClick={()=>setProblemType(p.id)}
                  style={{
                    padding:'16px',borderRadius:12,cursor:'pointer',
                    background: problemType===p.id?`${p.color}15`:'var(--bg-elevated)',
                    border:`2px solid ${problemType===p.id?p.color:'var(--border)'}`,
                    display:'flex',alignItems:'center',gap:12,transition:'all 0.2s',
                  }}>
                  <span style={{fontSize:28}}>{p.icon}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:problemType===p.id?p.color:'var(--text-primary)'}}>{p.label}</div>
                  </div>
                  {problemType===p.id && <div style={{marginLeft:'auto',color:p.color,fontWeight:700}}>✓</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Upload Evidence ── */}
        {step===1 && (
          <div>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Upload Photos / Videos of the damage</h3>
            <div className="upload-zone" onClick={()=>document.getElementById('evidence-upload').click()}>
              <div className="upload-zone-icon">📷</div>
              <p>Click to upload or take photo</p>
              <span>JPG, PNG, MP4 • Up to 50MB per file • Multiple allowed</span>
            </div>
            <input id="evidence-upload" type="file" accept="image/*,video/*" multiple style={{display:'none'}} onChange={handleImages} />

            {images.length > 0 && (
              <div style={{marginTop:14}}>
                <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:8}}>{images.length} file(s) uploaded</p>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  {images.map((img,i)=>(
                    <div key={i} style={{position:'relative'}}>
                      <img src={img} alt="" style={{width:80,height:80,objectFit:'cover',borderRadius:10,border:'2px solid var(--accent-blue)'}} />
                      <button onClick={()=>setImages(prev=>prev.filter((_,j)=>j!==i))}
                        style={{position:'absolute',top:-6,right:-6,width:18,height:18,borderRadius:'50%',background:'var(--accent-red)',border:'none',color:'white',fontSize:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        ×
                      </button>
                    </div>
                  ))}
                  <div onClick={()=>document.getElementById('evidence-upload').click()}
                    style={{width:80,height:80,borderRadius:10,border:'2px dashed var(--border)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-muted)',fontSize:24}}>
                    +
                  </div>
                </div>
              </div>
            )}

            {images.length===0 && (
              <div style={{marginTop:14,padding:'12px 14px',background:'rgba(59,130,246,0.08)',borderRadius:10}}>
                <p style={{fontSize:12,color:'var(--text-secondary)'}}>💡 <strong>Tip:</strong> Clear, well-lit photos help AI detect the damage accurately and speed up the resolution process.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Location ── */}
        {step===2 && <LocationStep location={location} setLocation={setLocation} />}

        {/* ── Step 3: AI Analysis ── */}
        {step===3 && <AiAnalysisStep problemType={problemType} images={images} />}

        {/* ── Step 4: Complaint Details ── */}
        {step===4 && (
          <div>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Add complaint details</h3>
            {pt && (
              <div className="ai-banner" style={{marginBottom:16}}>
                <div className="ai-banner-icon" style={{fontSize:28}}>{pt.icon}</div>
                <div className="ai-banner-text">
                  <h4>{pt.label}</h4>
                  <p>AI detected — 94% confidence • HIGH severity</p>
                </div>
                <div className="ai-confidence"><div className="pct">94%</div><span className="lbl">AI match</span></div>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Describe the road problem in detail — size, location specifics, danger level..." value={description} onChange={e=>setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Additional Notes (optional)</label>
              <textarea className="form-textarea" style={{minHeight:70}} placeholder="Any other information that might help the authority..." value={additionalNotes} onChange={e=>setNotes(e.target.value)} />
            </div>
            <div className="grid-2" style={{gap:12}}>
              <div className="form-group">
                <label className="form-label">Problem Category</label>
                <select className="form-select" value={problemType} onChange={e=>setProblemType(e.target.value)}>
                  {PROBLEM_TYPES.map(p=><option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Severity (AI detected)</label>
                <select className="form-select">
                  <option>🔴 HIGH (AI recommended)</option>
                  <option>🟡 MEDIUM</option>
                  <option>🟢 LOW</option>
                  <option>🔴 CRITICAL</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Review ── */}
        {step===5 && <ReviewStep data={data} />}

        {/* ── Step 6: Success ── */}
        {step===6 && <SuccessStep complaintId={complaintId} onNavChange={onNavChange} />}

        {/* Navigation Buttons */}
        {step < 6 && (
          <div style={{display:'flex',gap:10,marginTop:24,paddingTop:20,borderTop:'1px solid var(--border)'}}>
            {step>0 && (
              <button className="btn btn-secondary" onClick={()=>setStep(s=>s-1)}>
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <div style={{flex:1}} />
            {step===5 ? (
              <button className="btn btn-primary" onClick={handleSubmit} style={{gap:8}}>
                <Send size={15} /> Submit Complaint
              </button>
            ) : (
              <button className="btn btn-primary" onClick={()=>setStep(s=>s+1)} disabled={!canNext()}
                style={{opacity:canNext()?1:0.5}}>
                {step===3?'Continue →':'Next →'}<ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
