import Image from 'next/image';
import { getServerTranslation } from '@/lib/i18n/i18nServer';
import { supportedLocales } from '@/lib/i18n/i18nSettings';
import { LanguageSwitcher } from '../features/LanguageSwitcher';

const MainHeader = async () => {
	const { t } = await getServerTranslation();

	return (
		<header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
			<div className="flex items-center gap-2.5">
				<Image src="/logo-light.svg" alt="Logo" width={60} height={60} className="dark:invert" />
				<span className="text-2xl font-semibold tracking-tight block -ml-4">{t('appName')}</span>
			</div>
			<LanguageSwitcher languages={supportedLocales.map((locale) => locale)} />
		</header>
	);
};

export default MainHeader;
