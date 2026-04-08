import { FileConverter } from '@/components/features/FileConverter';
import { getServerTranslation } from '@/lib/i18n/i18nServer';

const HomePage = async () => {
	const { t } = await getServerTranslation();

	return (
		<div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
			<div className="mb-8 space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">{t('appName')}</h1>
				<p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{t('appDescription')}</p>
			</div>
			<FileConverter />
		</div>
	);
};

export default HomePage;

export const generateMetadata = async () => {
	const { t } = await getServerTranslation();

	return {
		title: t('pages.home'),
	};
};
