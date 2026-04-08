export const getAppBaseUrl = (): string => {
	const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;

	if (!baseUrl) throw new Error('NEXT_PUBLIC_APP_BASE_URL not defined in .env');

	return baseUrl;
};
