interface HeaderProps {
  relaisCount: number;
  filteredCount: number;
  lastUpdate?: string;
}

export function Header({ relaisCount, filteredCount, lastUpdate }: HeaderProps) {
  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Relaisblick" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Relaisblick</h1>
              <p className="text-sm text-primary-200">
                Österreichische Relais-Karte
              </p>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-primary-200">
              {filteredCount} von {relaisCount} Relais
            </div>
            {lastUpdate && (
              <div className="text-primary-300 text-xs">
                Stand: {new Date(lastUpdate).toLocaleDateString('de-AT')}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
