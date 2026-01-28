import { Koordinaten, Band, RelaisTyp } from '../types/relais';

/**
 * Formatiert eine Frequenz in MHz mit entsprechender Präzision
 */
export function formatFrequency(frequencyMHz: number): string {
  if (frequencyMHz >= 1000) {
    return `${frequencyMHz.toFixed(3)} MHz`;
  }
  return `${frequencyMHz.toFixed(4)} MHz`;
}

/**
 * Formatiert den Shift in kHz mit Vorzeichen
 */
export function formatShift(shiftKHz: number): string {
  const sign = shiftKHz >= 0 ? '+' : '';
  if (Math.abs(shiftKHz) >= 1000) {
    return `${sign}${(shiftKHz / 1000).toFixed(1)} MHz`;
  }
  return `${sign}${shiftKHz} kHz`;
}

/**
 * Formatiert CTCSS Ton
 */
export function formatCtcss(ctcss: number | undefined): string {
  if (!ctcss) return '-';
  return `${ctcss.toFixed(1)} Hz`;
}

/**
 * Berechnet die Entfernung zwischen zwei Koordinaten in km (Haversine-Formel)
 */
export function calculateDistance(
  point1: Koordinaten,
  point2: Koordinaten
): number {
  const R = 6371; // Erdradius in km
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Formatiert eine Entfernung
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Gibt eine lesbare Beschreibung des Bands zurück
 */
export function getBandDescription(band: Band): string {
  const descriptions: Record<Band, string> = {
    '10m': '28 MHz',
    '6m': '50 MHz',
    '2m': '144 MHz',
    '70cm': '430 MHz',
    '23cm': '1.3 GHz',
    '13cm': '2.3 GHz',
    '9cm': '3.4 GHz',
    '6cm': '5.7 GHz',
    '3cm': '10 GHz',
  };
  return descriptions[band];
}

/**
 * Gibt eine lesbare Beschreibung des Relaistyps zurück
 */
export function getTypDescription(typ: RelaisTyp): string {
  const descriptions: Record<RelaisTyp, string> = {
    'FM': 'Analog FM',
    'DMR': 'Digital Mobile Radio',
    'D-STAR': 'Digital Smart Tech',
    'C4FM': 'Yaesu System Fusion',
    'TETRA': 'TETRA Digital',
    'ATV': 'Amateur Television',
    'Bake': 'Bake/Beacon',
  };
  return descriptions[typ];
}

/**
 * Formatiert ein Datum für die Anzeige
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formatiert Koordinaten für die Anzeige
 */
export function formatCoordinates(koordinaten: Koordinaten): string {
  const latDir = koordinaten.lat >= 0 ? 'N' : 'S';
  const lngDir = koordinaten.lng >= 0 ? 'E' : 'W';
  return `${Math.abs(koordinaten.lat).toFixed(5)}° ${latDir}, ${Math.abs(koordinaten.lng).toFixed(5)}° ${lngDir}`;
}

/**
 * Formatiert Seehöhe
 */
export function formatAltitude(altitude: number | undefined): string {
  if (altitude === undefined) return '-';
  return `${altitude.toLocaleString('de-AT')} m`;
}

/**
 * Berechnet das nächste Update-Datum (Sonntag 03:00 UTC)
 */
export function getNextUpdateDate(): Date {
  const now = new Date();
  const nextSunday = new Date(now);

  // Finde den nächsten Sonntag
  const daysUntilSunday = (7 - now.getUTCDay()) % 7;

  // Wenn heute Sonntag ist und es noch vor 03:00 UTC ist, ist das Update heute
  if (daysUntilSunday === 0 && now.getUTCHours() < 3) {
    nextSunday.setUTCHours(3, 0, 0, 0);
  } else {
    // Sonst nächsten Sonntag
    nextSunday.setUTCDate(now.getUTCDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
    nextSunday.setUTCHours(3, 0, 0, 0);
  }

  return nextSunday;
}
