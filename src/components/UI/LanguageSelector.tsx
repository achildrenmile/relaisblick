import { useI18n, Language } from '../../i18n';

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; label: string }[] = [
    { code: 'de', label: 'DE' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang, index) => (
        <span key={lang.code} className="flex items-center">
          {index > 0 && <span className="text-primary-300 mx-1">|</span>}
          <button
            onClick={() => setLanguage(lang.code)}
            className={`text-sm transition-colors ${
              language === lang.code
                ? 'text-white font-semibold'
                : 'text-primary-300 hover:text-white'
            }`}
          >
            {lang.label}
          </button>
        </span>
      ))}
    </div>
  );
}

export default LanguageSelector;
