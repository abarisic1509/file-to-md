'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { i18nCookieName, isLanguageSupportedLocale } from './i18nSettings';

const changeSSRLanguage = async (language: string) => {
	const isSupported = isLanguageSupportedLocale(language);

	if (!isSupported) return;

	const cookieStore = await cookies();
	cookieStore.set(i18nCookieName, language, { path: '/' });

	revalidatePath('/', 'layout');
};

export default changeSSRLanguage;
