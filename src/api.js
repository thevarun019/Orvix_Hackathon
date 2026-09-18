import { getAuth } from './App';

const API_BASE = '/api';

const headers = () => {
  const auth = getAuth();
  return {
    'Content-Type': 'application/json',
    ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {})
  };
};

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  register: async (data) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  submitComplaint: async (data) => {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Submission failed');
    }
    return res.json();
  },

  getMyComplaints: async () => {
    const res = await fetch(`${API_BASE}/complaints/my`, {
      headers: headers()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch complaints');
    }
    const data = await res.json();
    return data.map(c => {
      let slaLeft = null;
      let sla = c.slaHours || 48;
      if (c.slaDeadline) {
        const diffHours = Math.round((new Date(c.slaDeadline).getTime() - new Date().getTime()) / 3600000);
        slaLeft = diffHours > 0 ? diffHours : 0;
      }
      
      let sev = 'medium';
      if (c.severity > 0.8) sev = 'critical';
      else if (c.severity > 0.6) sev = 'high';
      else if (c.severity < 0.4) sev = 'low';

      let st = 'pending';
      if (c.status === 'SUBMITTED') st = 'pending';
      if (c.status === 'IN_PROGRESS') st = 'progress';
      if (c.status === 'RESOLVED') st = 'resolved';
      if (c.status === 'ESCALATED') st = 'escalated';

      return {
        id: c.ticketNumber,
        type: c.damageType || 'Road Issue',
        location: c.address || 'Unknown Location',
        lat: c.latitude,
        lng: c.longitude,
        severity: sev,
        status: st,
        sla: sla,
        slaLeft: slaLeft,
        age: '1d',
        ward: 'Ward ' + (Math.floor(Math.random() * 20) + 1),
        authority: 'PWD',
        aiConfidence: c.severity ? Math.round(c.severity * 100) : 85,
        description: c.description || '',
        submittedAt: new Date(c.createdAt).toLocaleDateString(),
        assignedTo: c.assignedOfficerId ? 'Officer' : null,
        beforeImg: 'https://placehold.co/400x200?text=Pothole+Photo',
        afterImg: null,
        timeline: [
          { label: 'Complaint submitted', time: new Date(c.createdAt).toLocaleTimeString(), status: 'done' }
        ],
        comments: []
      };
    });
  },

  getAuthorityComplaints: async () => {
    const res = await fetch(`${API_BASE}/authority/complaints`, {
      headers: headers()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch assigned complaints');
    }
    const data = await res.json();
    // Same mapping as getMyComplaints for simplicity
    return data.map(c => {
      let slaLeft = null;
      let sla = c.slaHours || 48;
      if (c.slaDeadline) {
        const diffHours = Math.round((new Date(c.slaDeadline).getTime() - new Date().getTime()) / 3600000);
        slaLeft = diffHours > 0 ? diffHours : 0;
      }
      
      let sev = 'medium';
      if (c.severity > 0.8) sev = 'critical';
      else if (c.severity > 0.6) sev = 'high';
      else if (c.severity < 0.4) sev = 'low';

      let st = 'pending';
      if (c.status === 'SUBMITTED') st = 'pending';
      if (c.status === 'IN_PROGRESS') st = 'progress';
      if (c.status === 'RESOLVED') st = 'resolved';
      if (c.status === 'ESCALATED') st = 'escalated';

      return {
        id: c.ticketNumber,
        type: c.damageType || 'Road Issue',
        location: c.address || 'Unknown Location',
        lat: c.latitude,
        lng: c.longitude,
        severity: sev,
        status: st,
        sla: sla,
        slaLeft: slaLeft,
        age: '1d',
        ward: 'Ward ' + (Math.floor(Math.random() * 20) + 1),
        authority: 'PWD',
        aiConfidence: c.severity ? Math.round(c.severity * 100) : 85,
        description: c.description || '',
        submittedAt: new Date(c.createdAt).toLocaleDateString(),
        assignedTo: c.assignedOfficerId ? 'Officer' : null,
        beforeImg: 'https://placehold.co/400x200?text=Pothole+Photo',
        afterImg: null,
        timeline: [
          { label: 'Complaint submitted', time: new Date(c.createdAt).toLocaleTimeString(), status: 'done' }
        ],
        comments: []
      };
    });
  },

  updateComplaintStatus: async (id, status, remarks) => {
    // Map frontend status back to backend status
    let beStatus = 'IN_PROGRESS';
    if (status === 'resolved') beStatus = 'RESOLVED';
    else if (status === 'escalated') beStatus = 'ESCALATED';

    const res = await fetch(`${API_BASE}/authority/complaints/${id}/status`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ status: beStatus, remarks })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update status');
    }
    return res.json();
  },

  getStateKPIs: async () => {
    const res = await fetch(`${API_BASE}/state/kpis`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch state KPIs');
    return res.json();
  },

  getStateHeatmap: async () => {
    const res = await fetch(`${API_BASE}/state/heatmap`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch heatmap data');
    return res.json();
  },

  getDistrictPerformance: async () => {
    const res = await fetch(`${API_BASE}/state/district-performance`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch district performance');
    return res.json();
  }
};
