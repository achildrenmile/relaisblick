import { Relais, TYP_FARBEN, BAND_FARBEN } from '../../types/relais';
import {
  formatFrequency,
  formatShift,
  formatCtcss,
  formatCoordinates,
  formatAltitude,
} from '../../utils/formatters';

interface RelaisPopupProps {
  relais: Relais;
}

export function RelaisPopup({ relais }: RelaisPopupProps) {
  return (
    <div className="min-w-[250px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-lg">{relais.rufzeichen}</span>
        <span
          className="px-2 py-0.5 text-xs rounded text-white"
          style={{ backgroundColor: TYP_FARBEN[relais.typ] }}
        >
          {relais.typ}
        </span>
        <span
          className="px-2 py-0.5 text-xs rounded text-white"
          style={{ backgroundColor: BAND_FARBEN[relais.band] }}
        >
          {relais.band}
        </span>
      </div>

      <div className="text-sm text-gray-700 mb-3">
        <div className="font-medium">{relais.standort}</div>
        <div className="text-gray-500">{relais.bundesland}</div>
      </div>

      <table className="text-sm w-full">
        <tbody>
          <tr>
            <td className="text-gray-500 pr-3 py-0.5">TX:</td>
            <td className="font-mono">{formatFrequency(relais.txFrequenz)}</td>
          </tr>
          <tr>
            <td className="text-gray-500 pr-3 py-0.5">RX:</td>
            <td className="font-mono">{formatFrequency(relais.rxFrequenz)}</td>
          </tr>
          <tr>
            <td className="text-gray-500 pr-3 py-0.5">Shift:</td>
            <td className="font-mono">{formatShift(relais.shift)}</td>
          </tr>
          {relais.ctcss && (
            <tr>
              <td className="text-gray-500 pr-3 py-0.5">CTCSS:</td>
              <td className="font-mono">{formatCtcss(relais.ctcss)}</td>
            </tr>
          )}
          {relais.dcsCode && (
            <tr>
              <td className="text-gray-500 pr-3 py-0.5">DCS:</td>
              <td className="font-mono">{relais.dcsCode}</td>
            </tr>
          )}
          {relais.dmrId && (
            <tr>
              <td className="text-gray-500 pr-3 py-0.5">DMR ID:</td>
              <td className="font-mono">{relais.dmrId}</td>
            </tr>
          )}
          {relais.colorCode !== undefined && (
            <tr>
              <td className="text-gray-500 pr-3 py-0.5">Color Code:</td>
              <td className="font-mono">{relais.colorCode}</td>
            </tr>
          )}
          {relais.dstarModule && (
            <tr>
              <td className="text-gray-500 pr-3 py-0.5">D-STAR Modul:</td>
              <td className="font-mono">{relais.dstarModule}</td>
            </tr>
          )}
          {relais.echolink && (
            <tr>
              <td className="text-gray-500 pr-3 py-0.5">EchoLink:</td>
              <td className="font-mono">{relais.echolink}</td>
            </tr>
          )}
          {relais.seehöhe !== undefined && (
            <tr>
              <td className="text-gray-500 pr-3 py-0.5">Seehöhe:</td>
              <td className="font-mono">{formatAltitude(relais.seehöhe)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
        <div>{formatCoordinates(relais.koordinaten)}</div>
        {relais.betreiber && <div>Betreiber: {relais.betreiber}</div>}
        {relais.bemerkung && (
          <div className="mt-1 italic">{relais.bemerkung}</div>
        )}
      </div>
    </div>
  );
}

export default RelaisPopup;
