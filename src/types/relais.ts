export interface Koordinaten {
  lat: number;
  lng: number;
}

export type RelaisTyp = 'FM' | 'DMR' | 'D-STAR' | 'C4FM' | 'TETRA' | 'ATV' | 'Bake';

export type Band = '10m' | '6m' | '2m' | '70cm' | '23cm' | '13cm' | '9cm' | '6cm' | '3cm';

export type Bundesland =
  | 'Wien'
  | 'Niederösterreich'
  | 'Oberösterreich'
  | 'Steiermark'
  | 'Kärnten'
  | 'Salzburg'
  | 'Tirol'
  | 'Vorarlberg'
  | 'Burgenland';

export interface Relais {
  id: string;
  rufzeichen: string;
  standort: string;
  bundesland: Bundesland;
  koordinaten: Koordinaten;
  typ: RelaisTyp;
  band: Band;
  txFrequenz: number; // in MHz
  rxFrequenz: number; // in MHz
  shift: number; // in kHz
  ctcss?: number; // CTCSS Ton in Hz
  dcsCode?: string; // DCS Code
  echolink?: number; // Echolink Node Nummer
  dmrId?: number; // DMR ID
  colorCode?: number; // DMR Color Code
  dstarModule?: string; // D-STAR Modul (A, B, C)
  betreiber?: string;
  qth?: string;
  seehöhe?: number; // in Metern
  status: 'aktiv' | 'inaktiv' | 'unbekannt';
  bemerkung?: string;
  lastUpdate: string; // ISO Date String
}

export interface RelaisData {
  relais: Relais[];
  lastUpdate: string;
  version: string;
}

export interface FilterState {
  band: Band[];
  typ: RelaisTyp[];
  bundesland: Bundesland[];
  status: ('aktiv' | 'inaktiv' | 'unbekannt')[];
  searchQuery: string;
}

export const BANDS: Band[] = ['10m', '6m', '2m', '70cm', '23cm', '13cm', '9cm', '6cm', '3cm'];

export const RELAIS_TYPEN: RelaisTyp[] = ['FM', 'DMR', 'D-STAR', 'C4FM', 'TETRA', 'ATV', 'Bake'];

export const BUNDESLAENDER: Bundesland[] = [
  'Wien',
  'Niederösterreich',
  'Oberösterreich',
  'Steiermark',
  'Kärnten',
  'Salzburg',
  'Tirol',
  'Vorarlberg',
  'Burgenland',
];

export const BAND_FARBEN: Record<Band, string> = {
  '10m': '#f97316', // orange
  '6m': '#eab308',  // yellow
  '2m': '#22c55e',  // green
  '70cm': '#3b82f6', // blue
  '23cm': '#8b5cf6', // violet
  '13cm': '#ec4899', // pink
  '9cm': '#14b8a6',  // teal
  '6cm': '#f43f5e',  // rose
  '3cm': '#6366f1',  // indigo
};

export const TYP_FARBEN: Record<RelaisTyp, string> = {
  'FM': '#22c55e',    // green
  'DMR': '#3b82f6',   // blue
  'D-STAR': '#8b5cf6', // violet
  'C4FM': '#f97316',  // orange
  'TETRA': '#ec4899', // pink
  'ATV': '#ef4444',   // red
  'Bake': '#6b7280',  // gray
};
