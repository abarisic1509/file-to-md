import 'i18next';

import common from './locales/en/common.json';
import hrCommon from './locales/hr/common.json';
import ptCommon from './locales/pt/common.json';

export const defaultNS = 'common';
export const defaultLang = 'en';
export const i18nCookieName = 'language';

export const supportedLocales = [defaultLang, 'hr', 'pt'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const resources = {
	en: {
		common,
	},
	hr: {
		common: hrCommon,
	},
	pt: {
		common: ptCommon,
	},
} as const;

export const isLanguageSupportedLocale = (language?: string): language is SupportedLocale => {
	return Boolean(language) && supportedLocales.includes(language as SupportedLocale);
};

// Augment i18next types so `t()` only accepts keys that exist in the English
// translation JSONs. TypeScript will error on any typo or missing key at compile time.
declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: typeof defaultNS;
		resources: (typeof resources)[typeof defaultLang];
	}
}
