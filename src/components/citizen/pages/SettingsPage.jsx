import { useState } from 'react';
import { User, Bell, Shield, Smartphone, Globe, HelpCircle, ChevronRight, Phone } from 'lucide-react';

const SECTIONS = [
  { id: 'account', icon: <User size={18} />, title: 'Account Settings', desc: 'Update your personal details and password' },
  { id: 'notifications', icon: <Bell size={18} />, title: 'Notifications', desc: 'Manage email, SMS, and push alerts' },
  { id: 'privacy', icon: <Shield size={18} />, title: 'Privacy & Security', desc: 'Manage location permissions and data sharing' },
  { id: 'app', icon: <Smartphone size={18} />, title: 'App Preferences', desc: 'Theme, language, and accessibility' },
  { id: 'support', icon: <HelpCircle size={18} />, title: 'Help & Support', desc: 'FAQs, contact support, and report issues' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('notifications');
  const [notifSettings, setNotifSettings] = useState({
    complaintUpdates: true,
    slaAlerts: true,
    escalations: true,
    push: true,
    email: false,
    sms: true,
  });

  const toggle = (key) => setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>⚙️ Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage your RoadWatch preferences</p>
      </div>

      <div className="grid-col-1-2" style={{ gap: 24 }}>
        {/* Settings Menu */}
        <div className="card" style={{ padding: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SECTIONS.map(s => (
              <div 
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8,
                  background: activeSection === s.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                  border: `1px solid ${activeSection === s.id ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <div style={{ color: activeSection === s.id ? 'var(--accent-blue)' : 'var(--text-muted)' }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: activeSection === s.id ? 'var(--accent-blue)' : 'var(--text-primary)' }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.desc}</div>
                </div>
                <ChevronRight size={16} style={{ color: activeSection === s.id ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="card" style={{ padding: 32 }}>
          {activeSection === 'notifications' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Notification Preferences</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>Complaint Updates</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Receive notifications when complaint status changes</p>
                  </div>
                  <input type="checkbox" checked={notifSettings.complaintUpdates} onChange={() => toggle('complaintUpdates')} style={{ width: 18, height: 18 }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>SLA Alerts</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Warnings before SLAs are breached</p>
                  </div>
                  <input type="checkbox" checked={notifSettings.slaAlerts} onChange={() => toggle('slaAlerts')} style={{ width: 18, height: 18 }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>Escalation Notices</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>When your complaint is escalated</p>
                  </div>
                  <input type="checkbox" checked={notifSettings.escalations} onChange={() => toggle('escalations')} style={{ width: 18, height: 18 }} />
                </div>

                <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />

                <h4 style={{ fontSize: 14, fontWeight: 700 }}>Delivery Methods</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={16} /> Push Notifications</div>
                  <input type="checkbox" checked={notifSettings.push} onChange={() => toggle('push')} style={{ width: 18, height: 18 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={16} /> SMS Alerts</div>
                  <input type="checkbox" checked={notifSettings.sms} onChange={() => toggle('sms')} style={{ width: 18, height: 18 }} />
                </div>
              </div>
              <div style={{ marginTop: 32, textAlign: 'right' }}>
                <button className="btn btn-primary">Save Preferences</button>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Account Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" defaultValue="Rahul Sharma" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" defaultValue="rahul.s@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" defaultValue="+91 98765 43210" />
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-primary">Update Profile</button>
                </div>
                
                <h4 style={{ fontSize: 14, fontWeight: 700, marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>Password & Security</h4>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" />
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-secondary">Change Password</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Privacy & Security</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>Location Services</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Allow RoadWatch to use your GPS location when reporting issues</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>Anonymous Reporting</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hide your name from public dashboard views</p>
                  </div>
                  <input type="checkbox" style={{ width: 18, height: 18 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>Data Analytics</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Share anonymous usage data to help improve the app</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18 }} />
                </div>
                <div style={{ marginTop: 32 }}>
                  <button className="btn btn-secondary" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'app' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>App Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="form-group">
                  <label className="form-label">Theme</label>
                  <select className="form-select" defaultValue="system">
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select className="form-select" defaultValue="en">
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="mr">Marathi (मराठी)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>High Contrast</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Increase contrast for better readability</p>
                  </div>
                  <input type="checkbox" style={{ width: 18, height: 18 }} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'support' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>Help & Support</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <button className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '16px 20px', height: 'auto' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>FAQs</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Find answers to common questions</div>
                  </div>
                  <ChevronRight size={18} />
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '16px 20px', height: 'auto' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>Contact Support</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Get in touch with our team</div>
                  </div>
                  <ChevronRight size={18} />
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'space-between', padding: '16px 20px', height: 'auto' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>Report a Bug</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Found an issue with the app? Let us know</div>
                  </div>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
