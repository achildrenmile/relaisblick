import { useI18n } from '../../i18n';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  relaisCount: number;
  filteredCount: number;
  lastUpdate?: string;
}

export function Header({ relaisCount, filteredCount, lastUpdate }: HeaderProps) {
  const { t, language } = useI18n();

  const relaisCountText = t.relaisCount
    .replace('{filtered}', String(filteredCount))
    .replace('{total}', String(relaisCount));

  const dateLocale = language === 'de' ? 'de-AT' : 'en-GB';

  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Relaisblick" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">{t.appTitle}</h1>
              <p className="text-sm text-primary-200">
                {t.appSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="text-right text-sm">
              <div className="text-primary-200">
                {relaisCountText}
              </div>
              {lastUpdate && (
                <div className="text-primary-300 text-xs">
                  {t.lastUpdate.replace('{date}', new Date(lastUpdate).toLocaleDateString(dateLocale))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
