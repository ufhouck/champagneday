import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Users, Wind, Thermometer } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GUMUSLUK_POSITION: [number, number] = [37.05747117420014, 27.227133755885422];

interface LiveMapProps {
  windSpeed: number;
  windDegree: number;
  temperature: number;
}

function getCrowdEstimate(hour: number): string {
  const now = new Date();
  const currentHour = now.getHours();
  
  if (currentHour >= 22 || currentHour < 6) {
    return '0';
  }
  
  // Simulate crowd based on time of day
  if (currentHour >= 11 && currentHour <= 16) {
    return '2-3';
  }
  
  return '1';
}

export default function LiveMap({ windSpeed, windDegree, temperature }: LiveMapProps) {
  const [crowdEstimate, setCrowdEstimate] = useState(getCrowdEstimate(new Date().getHours()));

  useEffect(() => {
    const interval = setInterval(() => {
      setCrowdEstimate(getCrowdEstimate(new Date().getHours()));
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[190px]">
      <MapContainer
        center={GUMUSLUK_POSITION}
        zoom={15}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={GUMUSLUK_POSITION}>
          <Popup>
            <div className="text-center p-2">
              <h3 className="font-semibold text-lg mb-2">Champagne Bay</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Thermometer className="w-4 h-4 mr-1 text-orange-500" />
                    <span>Temperature</span>
                  </div>
                  <span className="font-medium">{temperature}°C</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Wind className="w-4 h-4 mr-1 text-blue-500" />
                    <span>Wind</span>
                  </div>
                  <span className="font-medium">{windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-purple-500" />
                    <span>People</span>
                  </div>
                  <span className="font-medium">{crowdEstimate}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}