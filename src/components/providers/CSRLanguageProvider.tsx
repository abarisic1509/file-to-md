'use client';

import { type ReactNode } from 'react';
import { initializeI18n } from '@/lib/i18n/i18nClient';
import { SupportedLocale } from '@/lib/i18n/i18nSettings';

interface CSRLanguageProviderProps {
	children: Readonly<ReactNode>;
	language: SupportedLocale;
}

export const CSRLanguageProvider = ({ children, language }: CSRLanguageProviderProps) => {
	initializeI18n(language);

	return children;
};
