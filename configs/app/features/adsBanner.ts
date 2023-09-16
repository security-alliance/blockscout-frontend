import type { Feature } from './types';
import type { AdButlerConfig } from 'types/client/adButlerConfig';
import type { AdBannerProviders } from 'types/client/adProviders';

import { getEnvValue, parseEnvJson } from '../utils';

const provider: AdBannerProviders = (() => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_AD_BANNER_PROVIDER) as AdBannerProviders;
  const SUPPORTED_AD_BANNER_PROVIDERS: Array<AdBannerProviders> = [ 'slise', 'adbutler', 'coinzilla', 'none', 'custom' ];

  return envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue : 'slise';
})();

const title = 'Banner ads';

type AdsBannerFeaturePayload =
    | {
      provider: Exclude<AdBannerProviders, 'adbutler' | 'none' | 'custom'>;
    }
    | {
      provider: 'adbutler';
      adButler: {
        config: {
          desktop: AdButlerConfig;
          mobile: AdButlerConfig;
        };
      };
    }
    | {
      provider: 'custom';
      custom: {
        config: {
          baseUrl: string;
          numAds: number;
        };
      };
    }

const config: Feature<AdsBannerFeaturePayload> = (() => {
  if (provider === 'adbutler') {
    const desktopConfig = parseEnvJson<AdButlerConfig>(getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP));
    const mobileConfig = parseEnvJson<AdButlerConfig>(getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE));

    if (desktopConfig && mobileConfig) {
      return Object.freeze({
        title,
        isEnabled: true,
        provider,
        adButler: {
          config: {
            desktop: desktopConfig,
            mobile: mobileConfig,
          },
        },
      });
    }
  } else if (provider === 'custom') {
    const baseUrl = getEnvValue(process.env.NEXT_PUBLIC_AD_CUSTOM_BASE_URL);
    const numAds = getEnvValue(process.env.NEXT_PUBLIC_AD_CUSTOM_NUM_ADS);

    if (baseUrl && numAds) {
      return Object.freeze({
        title,
        isEnabled: true,
        provider,
        custom: {
          config: {
            baseUrl,
            numAds: parseInt(numAds),
          },
        },
      });
    }
  } else if (provider !== 'none') {
    return Object.freeze({
      title,
      isEnabled: true,
      provider,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
