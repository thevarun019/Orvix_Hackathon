import { useRef, useEffect, useState } from 'react';
import { DISTRICTS } from '../../../data/mockData';

function StateMap() {
  const mapRef = useRef(null);
  const mapInst = useRef(null);

  useEffect(() => {
    let isMounted = true;
    import('leaflet').then(L => {
      if (!isMounted || !mapRef.current) return;
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }
      
      const map = L.map(mapRef.current, { 
        center: [26.5, 74.5], // Center of Rajasthan approx
        zoom: 7, 
        attributionControl: false 
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      DISTRICTS.forEach(d => {
        const radius = Math.max(10, Math.min(30, d.complaints / 100));
        const col = d.color === 'green' ? '#10b981' : d.color === 'yellow' ? '#f59e0b' : '#ef4444';
        
        L.circleMarker([d.lat, d.lng], {
          radius: radius,
          fillColor: col,
          color: 'white',
          weight: 2,
          fillOpacity: 0.7
        }).addTo(map).bindPopup(`
          <div style="font-family:Inter,sans-serif;font-size:13px;min-width:140px">
            <strong style="color:var(--text-primary);font-size:14px">${d.name}</strong><br/>
            <div style="margin-top:8px;display:flex;justify-content:space-between">
              <span style="color:var(--text-secondary)">Complaints:</span>
              <strong>${d.complaints}</strong>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:var(--text-secondary)">Resolution:</span>
              <strong style="color:${col}">${d.perf}%</strong>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:var(--text-secondary)">SLA Breaches:</span>
              <strong style="color:var(--accent-red)">${d.slaBreach}</strong>
            </div>
          </div>
        `);
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
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 12, border: '1px solid var(--border)' }} />;
}

export default function StateHeatmapPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🗺️ State GIS Heatmap</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Spatial analysis of road maintenance density across the state</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 200 }}>
            <option value="all">Overall Problem Density</option>
            <option value="sla">SLA Breach Hotspots</option>
            <option value="resolution">Fastest Resolution Zones</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ flex: 1, padding: 12, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <StateMap />
        </div>
        <div style={{ padding: '16px 8px 8px 8px', display: 'flex', gap: 24, fontSize: 12, color: 'var(--text-secondary)', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} /> Healthy ({'>'}80%)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} /> Needs Attention (70-80%)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} /> Critical ({'<'}70%)
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            Circle size indicates total complaint volume
          </div>
        </div>
      </div>
    </div>
  );
}
