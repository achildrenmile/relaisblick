import { useI18n } from '../../i18n';
import { useConfig } from '../../hooks/useConfig';

interface FooterProps {
  lastUpdate?: string;
  onOpenImprint: () => void;
  onOpenPrivacy: () => void;
}

export function Footer({ lastUpdate, onOpenImprint, onOpenPrivacy }: FooterProps) {
  const { t, language } = useI18n();
  const { config } = useConfig();
  const dateLocale = language === 'de' ? 'de-AT' : 'en-GB';

  return (
    <footer className="bg-gray-100 border-t border-gray-200 text-xs text-gray-600 flex-shrink-0 pb-safe">
      <div className="px-3 sm:px-4 py-2 sm:py-3">
        {/* Data sources - scrollable on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <div className="overflow-x-auto whitespace-nowrap sm:whitespace-normal pb-1 sm:pb-0 scrollbar-hide">
            <span className="font-medium">{t.dataSources}:</span>{' '}
            <a
              href="https://repeater.oevsv.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              ÖVSV
            </a>
            {' · '}
            <a
              href="https://dmraustria.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              DMR
            </a>
            {' · '}
            <a
              href="https://dstaraustria.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              D-STAR
            </a>
            {' · '}
            <a
              href="https://c4fmaustria.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              C4FM
            </a>
            <span className="hidden sm:inline"> (OE8VIK)</span>
          </div>
          {lastUpdate && (
            <div className="text-gray-500 text-[10px] sm:text-xs flex-shrink-0">
              {t.lastUpdate.replace('{date}', new Date(lastUpdate).toLocaleDateString(dateLocale))}
            </div>
          )}
        </div>
        {/* Disclaimer - hidden on mobile */}
        <div className="hidden sm:block mt-2 text-gray-500 text-[10px] leading-relaxed">
          <strong>{t.disclaimer}:</strong> {t.disclaimerText} {t.thanksForData} {t.weeklyUpdate} {t.noGuarantee}
        </div>
        {/* Legal links */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-300 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-gray-500 text-[10px]">
          {config.parentSiteName && config.parentSiteUrl && (
            <>
              <a
                href={config.parentSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                {t.partOfTools.replace('{name}', config.parentSiteName)}
              </a>
              <span className="hidden sm:inline">·</span>
            </>
          )}
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
