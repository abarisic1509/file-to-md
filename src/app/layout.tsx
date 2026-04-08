import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cookies } from 'next/headers';
import { CSRLanguageProvider } from '@/components/providers/CSRLanguageProvider';
import MainHeader from '@/components/shared/MainHeader';
import { getServerTranslation } from '@/lib/i18n/i18nServer';
import { defaultLang, i18nCookieName, isLanguageSupportedLocale, SupportedLocale } from '@/lib/i18n/i18nSettings';

const geistSans = Geist({
	variable: '--font-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

const RootLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const cookieStore = await cookies();
	const languageCookieValue = cookieStore.get(i18nCookieName)?.value;

	let language: SupportedLocale;

	if (isLanguageSupportedLocale(languageCookieValue)) {
		language = languageCookieValue;
	} else {
		language = defaultLang;
	}

	return (
		<html lang={language} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
			<CSRLanguageProvider language={language}>
				<body className="flex flex-col w-screen min-h-svh overflow-x-hidden items-center justify-start bg-zinc-50 font-sans dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
					<MainHeader />
					<main className="flex-1 flex flex-col">{children}</main>
				</body>
			</CSRLanguageProvider>
		</html>
	);
};

export default RootLayout;

export const generateMetadata = async () => {
	const { t } = await getServerTranslation();

	return {
		title: t('appName'),
		description: t('appDescription'),
		openGraph: {
			title: t('appName'),
			description: t('appDescription'),
		},
	};
};
