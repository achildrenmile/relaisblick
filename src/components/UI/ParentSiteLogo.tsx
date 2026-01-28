import { useConfig } from '../../hooks/useConfig';

export function ParentSiteLogo() {
  const { config, loading } = useConfig();

  if (loading || !config.parentSiteLogo || !config.parentSiteUrl) {
    return null;
  }

  return (
    <a
      href={config.parentSiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0"
    >
      <img
        src={config.parentSiteLogo}
        alt={config.parentSiteName || 'Parent Site'}
        className="h-20 sm:h-[150px] w-auto object-contain"
      />
    </a>
  );
}

export default ParentSiteLogo;
