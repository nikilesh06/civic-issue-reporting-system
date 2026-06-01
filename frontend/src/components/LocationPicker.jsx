import { useEffect, useRef } from 'react';

const LocationPicker = ({ lat, lng, onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then((L) => {
      if (mapInstance.current) return;

      // Fix default icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView([10.3673, 77.9803], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      mapInstance.current = map;

      if (lat && lng) {
        markerRef.current = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 15);
      }

      map.on('click', async (e) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = L.marker([clickLat, clickLng]).addTo(map);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickLat}&lon=${clickLng}`);
          const data = await res.json();
          onLocationSelect({ lat: clickLat, lng: clickLng, address: data.display_name || `${clickLat.toFixed(4)}, ${clickLng.toFixed(4)}` });
        } catch {
          onLocationSelect({ lat: clickLat, lng: clickLng, address: `${clickLat.toFixed(4)}, ${clickLng.toFixed(4)}` });
        }
      });
    });

    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
    };
  }, []);

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude: lat, longitude: lng } = coords;
      import('leaflet').then(async (L) => {
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = L.marker([lat, lng]).addTo(mapInstance.current);
        mapInstance.current.setView([lat, lng], 16);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          onLocationSelect({ lat, lng, address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
        } catch {
          onLocationSelect({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
        }
      });
    });
  };

  return (
    <div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <button type="button" onClick={useMyLocation} className="btn-secondary" style={{ marginBottom: 10, fontSize: '0.8rem', padding:'0.4rem 1rem' }}>
        📍 Use My Location
      </button>
      <div ref={mapRef} style={{ height: 280, borderRadius: 12, border: '1px solid #334155' }} />
      <p style={{ fontSize:'0.75rem', color:'#64748b', marginTop:6 }}>Click on the map to pin the issue location</p>
    </div>
  );
};

export default LocationPicker;
