'use server';

import { createInstance, i18n as I18nInstance, Namespace } from 'i18next';
import { cookies } from 'next/headers';
import {
	defaultLang,
	defaultNS,
	isLanguageSupportedLocale,
	resources,
	supportedLocales,
	SupportedLocale,
	i18nCookieName,
} from './i18nSettings';

const i18nInstances: Partial<Record<SupportedLocale, I18nInstance>> = {};

export const getServerTranslation = async (namespace?: Namespace) => {
	const cookieStore = await cookies();
	const languageCookieValue = cookieStore.get(i18nCookieName)?.value;

	let language: SupportedLocale;

	if (isLanguageSupportedLocale(languageCookieValue)) {
		language = languageCookieValue;
	} else {
		language = defaultLang;
	}

	const i18n = await getOrCreateI18nInstance(language);

	return {
		t: i18n.getFixedT(language, namespace),
		i18n,
		language,
	};
};

const getOrCreateI18nInstance = async (language: SupportedLocale) => {
	if (i18nInstances[language]) return i18nInstances[language]!;

	const instance = createInstance();

	await instance.init({
		lng: language,
		supportedLngs: supportedLocales,
		fallbackLng: defaultLang,
		ns: Object.keys(resources[defaultLang]) as string[],
		resources,
		defaultNS,
		interpolation: {
			escapeValue: false,
		},
		debug: false,
	});

	i18nInstances[language] = instance;

	return instance;
};
