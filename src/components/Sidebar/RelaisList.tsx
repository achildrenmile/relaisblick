import { useI18n } from '../../i18n';
import { Relais, TYP_FARBEN, BAND_FARBEN } from '../../types/relais';
import { formatFrequency, formatShift } from '../../utils/formatters';

interface RelaisListProps {
  relais: Relais[];
  selectedRelais: Relais | null;
  onSelectRelais: (relais: Relais) => void;
}

export function RelaisList({
  relais,
  selectedRelais,
  onSelectRelais,
}: RelaisListProps) {
  const { t } = useI18n();

  if (relais.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-3xl mb-2">📭</div>
        <p>{t.noRelaisFound}</p>
        <p className="text-sm">{t.tryAdjustFilters}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {relais.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelectRelais(r)}
          className={`w-full text-left p-3 rounded-lg border transition-all ${
            selectedRelais?.id === r.id
              ? 'border-primary-500 bg-primary-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{r.rufzeichen}</span>
                <span
                  className="px-1.5 py-0.5 text-xs rounded text-white"
                  style={{ backgroundColor: TYP_FARBEN[r.typ] }}
                >
                  {r.typ}
                </span>
                <span
                  className="px-1.5 py-0.5 text-xs rounded text-white"
                  style={{ backgroundColor: BAND_FARBEN[r.band] }}
                >
                  {r.band}
                </span>
              </div>
              <div className="text-sm text-gray-600 truncate">{r.standort}</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatFrequency(r.txFrequenz)} ({formatShift(r.shift)})
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  r.status === 'aktiv'
                    ? 'bg-green-500'
                    : r.status === 'inaktiv'
                    ? 'bg-red-500'
                    : 'bg-gray-400'
                }`}
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default RelaisList;
