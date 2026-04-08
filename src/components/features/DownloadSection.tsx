'use client';

import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

interface DownloadSectionProps {
	content: string;
	fileName: string;
}

export const DownloadSection = ({ content, fileName }: DownloadSectionProps) => {
	const { t } = useTranslation();

	const handleDownload = () => {
		try {
			const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${fileName}.md`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch {
			toast.error(t('downloadSection.failed'));
		}
	};

	return (
		<Button onClick={handleDownload} className="w-full gap-2">
			<Download className="size-4" />
			{t('downloadSection.download')}
		</Button>
	);
};
