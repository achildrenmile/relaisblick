import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Relais } from '../../types/relais';
import { RelaisMarker } from './RelaisMarker';

interface RelaisMapProps {
  relais: Relais[];
  selectedRelais: Relais | null;
  onSelectRelais: (relais: Relais) => void;
}

// Österreich Zentrum und Bounds
const AUSTRIA_CENTER: [number, number] = [47.5, 13.5];
const AUSTRIA_BOUNDS: [[number, number], [number, number]] = [
  [46.3, 9.5],
  [49.0, 17.2],
];

function MapController({ selectedRelais }: { selectedRelais: Relais | null }) {
  const map = useMap();
  const prevSelectedRef = useRef<string | null>(null);

  useEffect(() => {
    if (selectedRelais && selectedRelais.id !== prevSelectedRef.current) {
      map.flyTo(
        [selectedRelais.koordinaten.lat, selectedRelais.koordinaten.lng],
        12,
        { duration: 0.5 }
      );
      prevSelectedRef.current = selectedRelais.id;
    }
  }, [selectedRelais, map]);

  return null;
}

export function RelaisMap({
  relais,
  selectedRelais,
  onSelectRelais,
}: RelaisMapProps) {
  return (
    <MapContainer
      center={AUSTRIA_CENTER}
      zoom={8}
      maxBounds={AUSTRIA_BOUNDS}
      maxBoundsViscosity={0.8}
      minZoom={7}
      maxZoom={18}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedRelais={selectedRelais} />
      {relais.map((r) => (
        <RelaisMarker
          key={r.id}
          relais={r}
          isSelected={selectedRelais?.id === r.id}
          onClick={() => onSelectRelais(r)}
        />
      ))}
    </MapContainer>
  );
}

export default RelaisMap;
