import { CURRENT_USER } from '../../../data/mockData';
import { User, Mail, Phone, MapPin, CheckCircle, Edit3 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>👤 Profile</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage your personal information and preferences</p>
        </div>
        <button className="btn btn-primary btn-sm" style={{ gap: 8 }}>
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Main Info Card */}
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: '50%', background: 'var(--accent-blue)', 
              color: 'white', fontSize: 36, fontWeight: 700, display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 16px', border: '4px solid var(--bg-elevated)'
            }}>
              {CURRENT_USER.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{CURRENT_USER.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>Citizen ID: {CURRENT_USER.id}</p>
            {CURRENT_USER.verified && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                <CheckCircle size={14} /> Verified Citizen
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="card">
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>Contact Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Email</div>
                  <div style={{ fontSize: 14 }}>{CURRENT_USER.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Phone</div>
                  <div style={{ fontSize: 14 }}>{CURRENT_USER.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Address</div>
                  <div style={{ fontSize: 14 }}>{CURRENT_USER.area} ({CURRENT_USER.ward})</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Activity Summary */}
          <div className="card">
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>Activity Summary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Reports Submitted</span>
                <strong style={{ color: 'var(--text-primary)' }}>{CURRENT_USER.stats.submitted}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Resolved</span>
                <strong style={{ color: 'var(--accent-green)' }}>{CURRENT_USER.stats.resolved}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>In Progress</span>
                <strong style={{ color: 'var(--accent-orange)' }}>{CURRENT_USER.stats.inProgress}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Escalated</span>
                <strong style={{ color: 'var(--accent-red)' }}>{CURRENT_USER.stats.escalated}</strong>
              </div>
            </div>
          </div>
          
          <div className="card">
             <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>Account Details</h4>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Member Since</span>
                <strong style={{ color: 'var(--text-primary)' }}>{CURRENT_USER.joinedDate}</strong>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
