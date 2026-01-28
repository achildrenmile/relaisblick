import { useState, useEffect } from 'react';

export interface SiteConfig {
  parentSiteUrl: string | null;
  parentSiteLogo: string | null;
  parentSiteName: string | null;
}

const defaultConfig: SiteConfig = {
  parentSiteUrl: null,
  parentSiteLogo: null,
  parentSiteName: null,
};

let cachedConfig: SiteConfig | null = null;
let configPromise: Promise<SiteConfig> | null = null;

async function loadConfig(): Promise<SiteConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  if (configPromise) {
    return configPromise;
  }

  configPromise = fetch('/config.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Config not found');
      }
      return response.json();
    })
    .then((data) => {
      cachedConfig = {
        parentSiteUrl: data.parentSiteUrl || null,
        parentSiteLogo: data.parentSiteLogo || null,
        parentSiteName: data.parentSiteName || null,
      };
      return cachedConfig;
    })
    .catch(() => {
      cachedConfig = defaultConfig;
      return cachedConfig;
    });

  return configPromise;
}

export function useConfig(): { config: SiteConfig; loading: boolean } {
  const [config, setConfig] = useState<SiteConfig>(cachedConfig || defaultConfig);
  const [loading, setLoading] = useState(!cachedConfig);

  useEffect(() => {
    if (cachedConfig) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }

    loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
      setLoading(false);
    });
  }, []);

  return { config, loading };
}
