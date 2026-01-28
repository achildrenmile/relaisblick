import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Relais, TYP_FARBEN } from '../../types/relais';
import { RelaisPopup } from './RelaisPopup';

interface RelaisMarkerProps {
  relais: Relais;
  isSelected: boolean;
  onClick: () => void;
}

function createMarkerIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 14 : 10;
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: ${borderWidth}px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${isSelected ? 'transform: scale(1.2);' : ''}
      "></div>
    `,
    iconSize: [size + borderWidth * 2, size + borderWidth * 2],
    iconAnchor: [(size + borderWidth * 2) / 2, (size + borderWidth * 2) / 2],
    popupAnchor: [0, -(size / 2 + borderWidth)],
  });
}

export function RelaisMarker({ relais, isSelected, onClick }: RelaisMarkerProps) {
  const color = TYP_FARBEN[relais.typ];
  const icon = createMarkerIcon(color, isSelected);

  return (
    <Marker
      position={[relais.koordinaten.lat, relais.koordinaten.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <RelaisPopup relais={relais} />
      </Popup>
    </Marker>
  );
}

export default RelaisMarker;
