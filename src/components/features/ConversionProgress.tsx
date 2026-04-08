'use client';

import { useTranslation } from 'react-i18next';

import { Progress } from '@/components/ui/progress';

interface ConversionProgressProps {
	progress: number;
}

export const ConversionProgress = ({ progress }: ConversionProgressProps) => {
	const { t } = useTranslation();

	return (
		<div className="w-full space-y-2">
			<div className="flex items-center justify-between">
				<p className="text-sm text-zinc-600 dark:text-zinc-400">{t('conversion.progress')}</p>
				<span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">{Math.round(progress)}%</span>
			</div>
			<Progress value={progress} />
		</div>
	);
};
