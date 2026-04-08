'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultLang, defaultNS, resources, SupportedLocale } from './i18nSettings';

export const initializeI18n = (language: SupportedLocale) => {
	if (!i18next.isInitialized) {
		i18next.use(initReactI18next).init({
			resources,
			lng: language,
			fallbackLng: defaultLang,
			ns: Object.keys(resources[defaultLang]) as string[],
			defaultNS,
			interpolation: {
				escapeValue: false,
			},
		});
	} else if (i18next.language !== language) {
		i18next.changeLanguage(language);
	}
};
