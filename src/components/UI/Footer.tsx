import { useI18n } from '../../i18n';

interface FooterProps {
  lastUpdate?: string;
  onOpenImprint: () => void;
  onOpenPrivacy: () => void;
}

export function Footer({ lastUpdate, onOpenImprint, onOpenPrivacy }: FooterProps) {
  const { t, language } = useI18n();
  const dateLocale = language === 'de' ? 'de-AT' : 'en-GB';

  return (
    <footer className="bg-gray-100 border-t border-gray-200 text-xs text-gray-600">
      <div className="px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <span className="font-medium">{t.dataSources}:</span>{' '}
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
              {t.lastUpdate.replace('{date}', new Date(lastUpdate).toLocaleDateString(dateLocale))}
            </div>
          )}
        </div>
        <div className="mt-2 text-gray-500 text-[10px] leading-relaxed">
          <strong>{t.disclaimer}:</strong> {t.disclaimerText} {t.thanksForData} {t.weeklyUpdate} {t.noGuarantee}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-300 flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-500 text-[10px]">
          <button
            onClick={onOpenImprint}
            className="text-primary-600 hover:underline"
          >
            {t.imprint}
          </button>
          <span>|</span>
          <button
            onClick={onOpenPrivacy}
            className="text-primary-600 hover:underline"
          >
            {t.privacy}
          </button>
          <span>|</span>
          <a
            href="https://github.com/achildrenmile/relaisblick"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
