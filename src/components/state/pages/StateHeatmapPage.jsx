import { useRef, useEffect, useState } from 'react';
import { api } from '../../../api';

function StateMap({ points, filter }) {
  const mapRef = useRef(null);
  const mapInst = useRef(null);

  useEffect(() => {
    if (!points || points.length === 0) return;
    let isMounted = true;
    import('leaflet').then(L => {
      if (!isMounted || !mapRef.current) return;
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }
      const map = L.map(mapRef.current, {
        center: [26.5, 74.5],
        zoom: 7,
        attributionControl: false,
        scrollWheelZoom: false
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Filter logic based on selected dropdown
      const filtered = points.filter(p => {
        if (filter === 'sla') return p.severity > 0.7;
        if (filter === 'resolution') return p.severity < 0.4;
        return true;
      });

      filtered.forEach(p => {
        const col = p.severity > 0.7 ? '#ef4444' : p.severity > 0.4 ? '#f59e0b' : '#10b981';
        L.circleMarker([p.latitude, p.longitude], {
          radius: Math.max(6, Math.min(20, (p.severity || 0.5) * 20)),
          fillColor: col,
          color: 'white',
          weight: 2,
          fillOpacity: 0.75
        }).addTo(map).bindPopup(`
          <div style="font-family:Inter,sans-serif;font-size:13px;min-width:140px">
            <strong style="color:#111">Severity: ${(p.severity * 100).toFixed(0)}%</strong><br/>
            <span style="color:#666">Type: ${p.damageType || 'Road Issue'}</span><br/>
            <span style="color:${col};font-weight:700;text-transform:uppercase;font-size:11px">${p.status}</span>
          </div>
        `);
      });

      mapInst.current = map;
    });

    return () => {
      isMounted = false;
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    };
  }, [points, filter]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 12, border: '1px solid var(--border)' }} />;
}

export default function StateHeatmapPage() {
  const [filter, setFilter] = useState('all');
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStateHeatmap()
      .then(data => setPoints(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🗺️ State GIS Heatmap</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Spatial analysis of road maintenance density across the state</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Filter dropdown — reacts instantly, no page reload */}
          <select
            className="form-select"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ width: 220, transition: 'all 0.2s' }}
          >
            <option value="all">Overall Problem Density</option>
            <option value="sla">SLA Breach Hotspots</option>
            <option value="resolution">Fastest Resolution Zones</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ flex: 1, padding: 12, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          {loading
            ? <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading map data...</div>
            : <StateMap points={points} filter={filter} />
          }
        </div>
        <div style={{ padding: '16px 8px 8px', display: 'flex', gap: 24, fontSize: 12, color: 'var(--text-secondary)', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} /> Low Severity
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} /> Medium Severity
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} /> High / Critical
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            Circle size = relative severity • {points.length} live data points
          </div>
        </div>
      </div>
    </div>
  );
}
