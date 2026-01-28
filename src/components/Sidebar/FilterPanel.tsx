import {
  FilterState,
  Band,
  RelaisTyp,
  Bundesland,
  BANDS,
  RELAIS_TYPEN,
  BUNDESLAENDER,
  BAND_FARBEN,
  TYP_FARBEN,
} from '../../types/relais';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const toggleBand = (band: Band) => {
    const newBands = filters.band.includes(band)
      ? filters.band.filter((b) => b !== band)
      : [...filters.band, band];
    onFilterChange({ ...filters, band: newBands });
  };

  const toggleTyp = (typ: RelaisTyp) => {
    const newTypen = filters.typ.includes(typ)
      ? filters.typ.filter((t) => t !== typ)
      : [...filters.typ, typ];
    onFilterChange({ ...filters, typ: newTypen });
  };

  const toggleBundesland = (bl: Bundesland) => {
    const newBl = filters.bundesland.includes(bl)
      ? filters.bundesland.filter((b) => b !== bl)
      : [...filters.bundesland, bl];
    onFilterChange({ ...filters, bundesland: newBl });
  };

  const toggleStatus = (status: 'aktiv' | 'inaktiv' | 'unbekannt') => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFilterChange({ ...filters, status: newStatus });
  };

  const resetFilters = () => {
    onFilterChange({
      band: [],
      typ: [],
      bundesland: [],
      status: ['aktiv'],
      searchQuery: filters.searchQuery,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Filter</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-primary-600 hover:text-primary-800"
        >
          Zurücksetzen
        </button>
      </div>

      {/* Band Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Band</h4>
        <div className="flex flex-wrap gap-1">
          {BANDS.map((band) => (
            <button
              key={band}
              onClick={() => toggleBand(band)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                filters.band.includes(band)
                  ? 'text-white border-transparent'
                  : 'text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
              style={
                filters.band.includes(band)
                  ? { backgroundColor: BAND_FARBEN[band] }
                  : {}
              }
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      {/* Typ Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Typ</h4>
        <div className="flex flex-wrap gap-1">
          {RELAIS_TYPEN.map((typ) => (
            <button
              key={typ}
              onClick={() => toggleTyp(typ)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                filters.typ.includes(typ)
                  ? 'text-white border-transparent'
                  : 'text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
              style={
                filters.typ.includes(typ)
                  ? { backgroundColor: TYP_FARBEN[typ] }
                  : {}
              }
            >
              {typ}
            </button>
          ))}
        </div>
      </div>

      {/* Bundesland Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Bundesland</h4>
        <div className="flex flex-wrap gap-1">
          {BUNDESLAENDER.map((bl) => (
            <button
              key={bl}
              onClick={() => toggleBundesland(bl)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                filters.bundesland.includes(bl)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {bl}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Status</h4>
        <div className="flex flex-wrap gap-1">
          {(['aktiv', 'inaktiv', 'unbekannt'] as const).map((status) => (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                filters.status.includes(status)
                  ? status === 'aktiv'
                    ? 'bg-green-500 text-white border-green-500'
                    : status === 'inaktiv'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-gray-500 text-white border-gray-500'
                  : 'text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
