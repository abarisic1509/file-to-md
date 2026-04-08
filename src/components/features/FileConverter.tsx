'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ConversionProgress } from '@/components/features/ConversionProgress';
import { DownloadSection } from '@/components/features/DownloadSection';
import { FileUpload } from '@/components/features/FileUpload';
import { MarkdownPreview } from '@/components/features/MarkdownPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getFileNameWithoutExtension } from '@/lib/fileUtils';

type ConversionState = 'idle' | 'uploading' | 'converting' | 'done' | 'error';

export const FileConverter = () => {
	const { t } = useTranslation();

	const [file, setFile] = useState<File | null>(null);
	const [customName, setCustomName] = useState('');
	const [state, setState] = useState<ConversionState>('idle');
	const [progress, setProgress] = useState(0);
	const [markdownContent, setMarkdownContent] = useState('');
	const [outputFileName, setOutputFileName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const handleFileSelect = (selectedFile: File, name: string) => {
		setFile(selectedFile);
		setCustomName(name);
		setState('idle');
		setMarkdownContent('');
		setOutputFileName('');
		setErrorMessage('');
		setProgress(0);
	};

	const handleClear = () => {
		setFile(null);
		setCustomName('');
		setState('idle');
		setMarkdownContent('');
		setOutputFileName('');
		setErrorMessage('');
		setProgress(0);
	};

	const handleConvert = async () => {
		if (!file) {
			setErrorMessage(t('upload.noFile'));

			return;
		}

		setState('converting');
		setProgress(0);
		setErrorMessage('');

		// Simulate progress
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 90) {
					clearInterval(progressInterval);

					return 90;
				}

				return prev + Math.random() * 15;
			});
		}, 200);

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/convert', {
				method: 'POST',
				body: formData,
			});

			clearInterval(progressInterval);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'CONVERSION_FAILED');
			}

			const data = await response.json();

			setProgress(100);
			setMarkdownContent(data.markdown);
			setOutputFileName(customName || getFileNameWithoutExtension(file.name));
			setState('done');
		} catch (error) {
			clearInterval(progressInterval);
			const code = error instanceof Error ? error.message : 'CONVERSION_FAILED';
			const errorKey = `conversion.errors.${code}` as const;
			const message = t(errorKey, { defaultValue: t('conversion.failed') });
			setState('error');
			setErrorMessage(message || t('conversion.failed'));
			setProgress(0);
		}
	};

	const isConverting = state === 'converting';
	const isDone = state === 'done';

	return (
		<Card className="w-full max-w-4xl">
			<CardContent className="space-y-6">
				<FileUpload onFileSelect={handleFileSelect} onClear={handleClear} disabled={isConverting} />

				{file && !isDone && (
					<Button onClick={handleConvert} disabled={isConverting} className="w-full">
						{isConverting ? t('conversion.converting') : t('conversion.convert')}
					</Button>
				)}

				{isConverting && <ConversionProgress progress={progress} />}

				{errorMessage && <p className="text-center text-sm text-destructive">{errorMessage}</p>}

				{isDone && file && (
					<>
						<MarkdownPreview
							content={markdownContent}
							fileName={outputFileName}
							onFileNameChange={setOutputFileName}
							onContentChange={setMarkdownContent}
						/>
						<DownloadSection content={markdownContent} fileName={outputFileName} />
					</>
				)}
			</CardContent>
		</Card>
	);
};
