// ============================================================
// RoadWatch — Complete Mock Data
// ============================================================

export const CURRENT_USER = {
  id: 'CIT-2024-001',
  name: 'Varun Bhardwaj',
  email: 'varun@roadwatch.in',
  phone: '+91 98765 43210',
  ward: 'Ward 12',
  area: 'Malviya Nagar, Jaipur',
  joinedDate: 'January 2024',
  verified: true,
  avatar: null,
  stats: { submitted: 24, resolved: 19, inProgress: 3, escalated: 2 },
};

export const COMPLAINTS = [
  {
    id: 'RW-00124', type: 'Pothole', location: 'MG Road, Ward 12', lat: 26.915, lng: 75.792,
    severity: 'high', status: 'progress', sla: 24, slaLeft: 6, age: '18h',
    ward: 'Ward 12', authority: 'Road Maintenance Department', aiConfidence: 94,
    description: 'Large pothole in the middle of MG Road causing vehicle damage.',
    submittedAt: '10:32 AM, 12 Sep', assignedTo: 'Team B',
    beforeImg: 'https://placehold.co/400x200?text=Pothole+Photo',
    afterImg: null,
    timeline: [
      { label: 'Complaint submitted',    time: '10:32 AM',  status: 'done' },
      { label: 'AI verification',        time: '10:33 AM',  status: 'done' },
      { label: 'Assigned to authority',  time: '10:34 AM',  status: 'done' },
      { label: 'Authority acknowledged', time: '12:15 PM',  status: 'done' },
      { label: 'Repair in progress',     time: '3:20 PM',   status: 'active' },
      { label: 'Verification',           time: '',          status: 'pending' },
      { label: 'Resolved',               time: '',          status: 'pending' },
    ],
    duplicateOf: 'RW-00119', dupDistance: '37m',
    comments: [
      { author: 'Road Dept.', text: 'Team dispatched to site.', time: '3:00 PM' },
      { author: 'You', text: 'Still not fixed, please expedite.', time: '4:00 PM' },
    ],
  },
  {
    id: 'RW-00119', type: 'Broken Road', location: 'Tonk Road, Ward 8', lat: 26.885, lng: 75.805,
    severity: 'medium', status: 'resolved', sla: 48, slaLeft: null, age: '2d',
    ward: 'Ward 8', authority: 'PWD Jaipur', aiConfidence: 89,
    description: 'Road surface has completely broken near the bus stop.',
    submittedAt: '9:15 AM, 10 Sep', assignedTo: 'Team A',
    beforeImg: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=70',
    afterImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
    timeline: [
      { label: 'Complaint submitted',    time: '9:15 AM',  status: 'done' },
      { label: 'AI verification',        time: '9:16 AM',  status: 'done' },
      { label: 'Assigned to authority',  time: '9:20 AM',  status: 'done' },
      { label: 'Authority acknowledged', time: '10:00 AM', status: 'done' },
      { label: 'Repair in progress',     time: '2:00 PM',  status: 'done' },
      { label: 'Verification',           time: '5:00 PM',  status: 'done' },
      { label: 'Resolved',               time: '5:15 PM',  status: 'done' },
    ],
    duplicateOf: null, dupDistance: null, comments: [],
  },
  {
    id: 'RW-00103', type: 'Open Manhole', location: 'Civil Lines, Ward 14', lat: 26.930, lng: 75.818,
    severity: 'critical', status: 'escalated', sla: 12, slaLeft: 0, age: '3d',
    ward: 'Ward 14', authority: 'JDA Jaipur', aiConfidence: 97,
    description: 'Open manhole without cover posing severe risk to pedestrians and vehicles.',
    submittedAt: '7:45 AM, 9 Sep', assignedTo: 'Team C',
    beforeImg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70',
    afterImg: null,
    timeline: [
      { label: 'Complaint submitted',        time: '7:45 AM',         status: 'done' },
      { label: 'AI verification',            time: '7:46 AM',         status: 'done' },
      { label: 'Assigned to authority',      time: '7:50 AM',         status: 'done' },
      { label: '⚠ SLA Breached — Escalated', time: '7:50 AM, 10 Sep', status: 'done' },
      { label: 'Repair in progress',         time: '',                status: 'pending' },
      { label: 'Verification',               time: '',                status: 'pending' },
      { label: 'Resolved',                   time: '',                status: 'pending' },
    ],
    duplicateOf: null, dupDistance: null, comments: [],
  },
  {
    id: 'RW-00130', type: 'Road Crack', location: 'Vaishali Nagar, Ward 6', lat: 26.898, lng: 75.766,
    severity: 'medium', status: 'pending', sla: 72, slaLeft: 42, age: '30h',
    ward: 'Ward 6', authority: 'Road Maintenance Department', aiConfidence: 82,
    description: 'Wide crack across the road, worsening with rain.',
    submittedAt: '8:00 AM, 11 Sep', assignedTo: null,
    beforeImg: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400&q=70',
    afterImg: null,
    timeline: [
      { label: 'Complaint submitted',    time: '8:00 AM', status: 'done' },
      { label: 'AI verification',        time: '8:01 AM', status: 'done' },
      { label: 'Assigned to authority',  time: '8:05 AM', status: 'done' },
      { label: 'Authority acknowledged', time: '',        status: 'pending' },
      { label: 'Repair in progress',     time: '',        status: 'pending' },
      { label: 'Verification',           time: '',        status: 'pending' },
      { label: 'Resolved',               time: '',        status: 'pending' },
    ],
    duplicateOf: null, dupDistance: null, comments: [],
  },
  {
    id: 'RW-00131', type: 'Drainage Issue', location: 'Mansarovar, Ward 9', lat: 26.858, lng: 75.778,
    severity: 'low', status: 'pending', sla: 72, slaLeft: 20, age: '52h',
    ward: 'Ward 9', authority: 'Jaipur MC', aiConfidence: 75,
    description: 'Blocked drainage causing waterlogging on road.',
    submittedAt: '11:30 AM, 10 Sep', assignedTo: null,
    beforeImg: 'https://images.unsplash.com/photo-1553522991-c3cf8cd0aea1?w=400&q=70',
    afterImg: null,
    timeline: [
      { label: 'Complaint submitted',    time: '11:30 AM', status: 'done' },
      { label: 'AI verification',        time: '11:31 AM', status: 'done' },
      { label: 'Assigned to authority',  time: '11:35 AM', status: 'done' },
      { label: 'Authority acknowledged', time: '',         status: 'pending' },
      { label: 'Repair in progress',     time: '',         status: 'pending' },
      { label: 'Verification',           time: '',         status: 'pending' },
      { label: 'Resolved',               time: '',         status: 'pending' },
    ],
    duplicateOf: null, dupDistance: null, comments: [],
  },
  {
    id: 'RW-00087', type: 'Broken Road', location: 'Sindhi Camp, Ward 3', lat: 26.922, lng: 75.803,
    severity: 'high', status: 'resolved', sla: 48, slaLeft: null, age: '5d',
    ward: 'Ward 3', authority: 'PWD Jaipur', aiConfidence: 91,
    description: 'Road broken near railway crossing.',
    submittedAt: '6:00 AM, 7 Sep', assignedTo: 'Team A',
    beforeImg: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400&q=70',
    afterImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
    timeline: [
      { label: 'Complaint submitted',    time: '6:00 AM', status: 'done' },
      { label: 'AI verification',        time: '6:01 AM', status: 'done' },
      { label: 'Assigned to authority',  time: '6:05 AM', status: 'done' },
      { label: 'Authority acknowledged', time: '9:00 AM', status: 'done' },
      { label: 'Repair in progress',     time: '1:00 PM', status: 'done' },
      { label: 'Verification',           time: '4:00 PM', status: 'done' },
      { label: 'Resolved',               time: '4:30 PM', status: 'done' },
    ],
    duplicateOf: null, dupDistance: null, comments: [],
  },
];

export const MY_COMPLAINT_IDS = ['RW-00124', 'RW-00119', 'RW-00103', 'RW-00130', 'RW-00131', 'RW-00087'];

export const NOTIFICATIONS = [
  { id: 1, category: 'complaint', icon: '🔄', title: 'Complaint Assigned', message: 'RW-00124 has been assigned to Road Maintenance Department.', time: '15 min ago', read: false, color: '#3b82f6' },
  { id: 2, category: 'sla', icon: '⏱️', title: 'SLA Warning', message: 'Your complaint RW-00130 has 20 hours remaining before SLA breach.', time: '1 hr ago', read: false, color: '#f59e0b' },
  { id: 3, category: 'escalation', icon: '⚠️', title: 'Complaint Escalated', message: 'RW-00103 has been escalated to the higher authority due to SLA breach.', time: '3 hrs ago', read: true, color: '#ef4444' },
  { id: 4, category: 'resolution', icon: '✅', title: 'Complaint Resolved', message: 'Your complaint RW-00119 (Broken Road, Tonk Road) has been resolved.', time: '2 days ago', read: true, color: '#10b981' },
  { id: 5, category: 'complaint', icon: '👁️', title: 'Authority Acknowledged', message: 'Road Maintenance Department has acknowledged complaint RW-00124.', time: '3 days ago', read: true, color: '#3b82f6' },
  { id: 6, category: 'system', icon: '🛠️', title: 'System Maintenance', message: 'RoadWatch scheduled maintenance on 14 Sep 2026, 2:00–4:00 AM.', time: '4 days ago', read: true, color: '#8b5cf6' },
  { id: 7, category: 'resolution', icon: '✅', title: 'Complaint Resolved', message: 'RW-00087 (Broken Road, Sindhi Camp) has been successfully repaired.', time: '5 days ago', read: true, color: '#10b981' },
];

export const PROBLEM_TYPES = [
  { id: 'pothole',       icon: '🕳️', label: 'Pothole',               color: '#ef4444' },
  { id: 'crack',         icon: '⚡', label: 'Road Crack',             color: '#f59e0b' },
  { id: 'broken',        icon: '🛣️', label: 'Broken Road',           color: '#f97316' },
  { id: 'manhole',       icon: '🔓', label: 'Open Manhole',           color: '#8b5cf6' },
  { id: 'waterlogging',  icon: '💧', label: 'Waterlogging',           color: '#06b6d4' },
  { id: 'divider',       icon: '🚧', label: 'Damaged Divider',        color: '#f97316' },
  { id: 'sign',          icon: '🚦', label: 'Missing/Damaged Sign',   color: '#f59e0b' },
  { id: 'streetlight',   icon: '💡', label: 'Streetlight Problem',    color: '#eab308' },
  { id: 'drainage',      icon: '🌊', label: 'Drainage Problem',       color: '#3b82f6' },
  { id: 'other',         icon: '⚠️', label: 'Other',                  color: '#64748b' },
];

export const AUTHORITY_KPIs = { open: 128, critical: 12, slaBreach: 18, inProgress: 46, resolved: 312 };

export const STATE_KPIs = {
  total: 48291, resolved: 39842, pending: 8449, violations: 2183,
  resolutionRate: 82.5, avgResolution: 41.2,
};

export const DISTRICTS = [
  { name: 'Jaipur Zone A', complaints: 2410, resolved: 2120, slaBreach: 82,  perf: 92, color: 'green',  lat: 26.95, lng: 75.72 },
  { name: 'Jaipur Zone B', complaints: 3102, resolved: 2401, slaBreach: 301, perf: 75, color: 'yellow', lat: 26.82, lng: 75.89 },
  { name: 'Jodhpur',        complaints: 1840, resolved: 1210, slaBreach: 420, perf: 66, color: 'red',    lat: 26.28, lng: 73.02 },
  { name: 'Udaipur',        complaints: 1532, resolved: 1221, slaBreach: 210, perf: 71, color: 'yellow', lat: 24.59, lng: 73.68 },
  { name: 'Kota',           complaints: 1301, resolved: 1032, slaBreach: 98,  perf: 86, color: 'green',  lat: 25.21, lng: 75.84 },
  { name: 'Ajmer',          complaints: 960,  resolved: 845,  slaBreach: 75,  perf: 88, color: 'green',  lat: 26.45, lng: 74.64 },
  { name: 'Bikaner',        complaints: 820,  resolved: 580,  slaBreach: 180, perf: 58, color: 'red',    lat: 28.01, lng: 73.31 },
  { name: 'Sikar',          complaints: 640,  resolved: 510,  slaBreach: 60,  perf: 80, color: 'green',  lat: 27.61, lng: 75.14 },
];

export const TREND_DATA = {
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
  complaints:    [3200,3800,4100,4800,5200,5800,5400,5821],
  resolved:      [2800,3300,3700,4200,4600,5100,4900,4992],
  slaViolations: [320, 410, 380, 520, 490, 580, 510, 430],
};

export const DAMAGE_TYPES = [
  { label: 'Potholes', value: 42, color: '#ef4444' },
  { label: 'Cracks',   value: 21, color: '#f97316' },
  { label: 'Manhole',  value: 12, color: '#f59e0b' },
  { label: 'Drainage', value: 14, color: '#3b82f6' },
  { label: 'Others',   value: 11, color: '#8b5cf6' },
];

export const PROBLEMATIC_ROADS = [
  { area: 'Ward 18', count: 842 },
  { area: 'Ward 7',  count: 768 },
  { area: 'Ward 12', count: 534 },
  { area: 'Ward 3',  count: 421 },
  { area: 'Ward 9',  count: 398 },
];

export const RECENT_ACTIVITY = [
  { text: 'RW-00124 assigned to Team B',             time: '15 min ago', color: '#3b82f6' },
  { text: 'Repair evidence uploaded (RW-00119)',      time: '32 min ago', color: '#10b981' },
  { text: 'SLA breached (RW-00130)',                  time: '1 hr ago',   color: '#ef4444' },
  { text: 'Status updated to In Progress (RW-00125)', time: '2 hr ago',   color: '#f59e0b' },
  { text: 'New complaint received (RW-00132)',         time: '3 hr ago',   color: '#8b5cf6' },
];

export const WORKERS = [
  { id: 'w1', name: 'Team A', role: 'Pothole Repair Team', zone: 'Ward 3, Ward 8', status: 'active', workload: 3 },
  { id: 'w2', name: 'Team B', role: 'Rapid Action Force', zone: 'Ward 12, Ward 14', status: 'active', workload: 5 },
  { id: 'w3', name: 'Team C', role: 'Drainage Specialists', zone: 'Ward 6, Ward 9', status: 'offline', workload: 0 },
  { id: 'w4', name: 'Team D', role: 'General Maintenance', zone: 'All Wards', status: 'active', workload: 2 },
  { id: 'w5', name: 'John Smith', role: 'Field Inspector', zone: 'Zone A', status: 'active', workload: 1 },
  { id: 'w6', name: 'Raj Kumar', role: 'Contractor', zone: 'Zone B', status: 'offline', workload: 0 },
  { id: 'w7', name: 'Priya Sharma', role: 'Field Inspector', zone: 'Zone C', status: 'active', workload: 2 }
];

// Helpers
export const getMyComplaints = () => MY_COMPLAINT_IDS.map(id => COMPLAINTS.find(c => c.id === id)).filter(Boolean);
export const getComplaint    = (id) => COMPLAINTS.find(c => c.id === id);

export const typeIcon  = (t) => ({ 'Pothole':'🕳️','Broken Road':'🛣️','Open Manhole':'🔓','Road Crack':'⚡','Drainage Issue':'💧','Waterlogging':'💧','Damaged Divider':'🚧','Streetlight Problem':'💡' }[t] || '⚠️');
export const typeColor = (t) => ({ 'Pothole':'#ef4444','Broken Road':'#f97316','Open Manhole':'#8b5cf6','Road Crack':'#f59e0b','Drainage Issue':'#06b6d4' }[t] || '#3b82f6');

export const severityLabel = { critical:'🔴 Critical', high:'🟠 High', medium:'🟡 Medium', low:'🟢 Low' };
export const statusLabel   = { pending:'Pending', progress:'In Progress', resolved:'Resolved', escalated:'Escalated' };
export const slaLabel      = (c) => c.status === 'resolved' ? '✓ Resolved' : c.status === 'escalated' || c.slaLeft === 0 ? 'Breached' : c.slaLeft != null ? `${c.slaLeft}h left` : '—';
