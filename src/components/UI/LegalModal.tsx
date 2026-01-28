import { useEffect } from 'react';
import { useI18n } from '../../i18n';

interface LegalModalProps {
  type: 'imprint' | 'privacy';
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === 'imprint' ? t.imprintTitle : t.privacyTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label={t.close}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {type === 'imprint' ? <ImprintContent /> : <PrivacyContent />}
        </div>
      </div>
    </div>
  );
}

function ImprintContent() {
  const { t } = useI18n();

  return (
    <div className="space-y-6 text-gray-700">
      <p className="text-sm text-gray-500">{t.imprintInfo}</p>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.imprintOperator}
        </h3>
        <div className="space-y-1">
          <p className="font-medium">{t.imprintOperatorName}</p>
          <p>{t.imprintOperatorCallsign}</p>
          <p>{t.imprintOperatorAddress}</p>
          <p>{t.imprintOperatorCountry}</p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.imprintContact}
        </h3>
        <a
          href={`mailto:${t.imprintContactEmail}`}
          className="text-primary-600 hover:underline"
        >
          {t.imprintContactEmail}
        </a>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.imprintLiabilityTitle}
        </h3>
        <p>{t.imprintLiabilityText}</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.imprintCopyrightTitle}
        </h3>
        <p>{t.imprintCopyrightText}</p>
      </section>
    </div>
  );
}

function PrivacyContent() {
  const { t } = useI18n();

  return (
    <div className="space-y-6 text-gray-700">
      <p>{t.privacyIntro}</p>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.privacyNoDataTitle}
        </h3>
        <p className="mb-2">{t.privacyNoDataText}</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{t.privacyNoDataForms}</li>
          <li>{t.privacyNoDataCookies}</li>
          <li>{t.privacyNoDataTracking}</li>
          <li>{t.privacyNoDataServer}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.privacyLocalStorageTitle}
        </h3>
        <p>{t.privacyLocalStorageText}</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.privacyCloudflareTitle}
        </h3>
        <p>{t.privacyCloudflareText}</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.privacyRightsTitle}
        </h3>
        <p>{t.privacyRightsText}</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t.privacyContactTitle}
        </h3>
        <p className="mb-2">{t.privacyContactText}</p>
        <a
          href={`mailto:${t.imprintContactEmail}`}
          className="text-primary-600 hover:underline"
        >
          {t.imprintContactEmail}
        </a>
      </section>
    </div>
  );
}

export default LegalModal;
