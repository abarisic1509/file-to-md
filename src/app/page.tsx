import { getServerTranslation } from '@/lib/i18n/i18nServer';

const HomePage = async () => {
	const { t } = await getServerTranslation();

	return (
		<div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			{t('appName')}
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
