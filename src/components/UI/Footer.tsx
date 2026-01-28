interface FooterProps {
  lastUpdate?: string;
}

export function Footer({ lastUpdate }: FooterProps) {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 text-xs text-gray-600">
      <div className="px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <span className="font-medium">Datenquellen:</span>{' '}
            <a
              href="https://repeater.oevsv.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              ÖVSV Repeater DB
            </a>
            {' · '}
            <a
              href="https://dmraustria.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              DMR Austria
            </a>
            {' · '}
            <a
              href="https://dstaraustria.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              D-STAR Austria
            </a>
            {' · '}
            <a
              href="https://c4fmaustria.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              C4FM Austria
            </a>
            <span className="hidden md:inline"> (OE8VIK)</span>
          </div>
          {lastUpdate && (
            <div className="text-gray-500">
              Stand: {new Date(lastUpdate).toLocaleDateString('de-AT')}
            </div>
          )}
        </div>
        <div className="mt-2 text-gray-500 text-[10px] leading-relaxed">
          <strong>Disclaimer:</strong> Die FM-Relaisdaten stammen vom{' '}
          <a href="https://repeater.oevsv.at" target="_blank" rel="noopener noreferrer" className="underline">
            ÖVSV UKW-Referat (repeater.oevsv.at)
          </a>
          . Die Daten für DMR, D-STAR und C4FM stammen von OE8VIK (Michi) via{' '}
          <a href="https://dmraustria.at" target="_blank" rel="noopener noreferrer" className="underline">
            dmraustria.at
          </a>
          ,{' '}
          <a href="https://dstaraustria.at" target="_blank" rel="noopener noreferrer" className="underline">
            dstaraustria.at
          </a>
          {' und '}
          <a href="https://c4fmaustria.at" target="_blank" rel="noopener noreferrer" className="underline">
            c4fmaustria.at
          </a>
          . Besten Dank für die Bereitstellung der Daten! Alle Angaben ohne Gewähr. Bei Fehlern oder Änderungswünschen bitte direkt an die jeweilige Datenquelle wenden.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
