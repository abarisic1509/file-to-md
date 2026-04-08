'use client';

import { type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MarkdownPreviewProps {
	content: string;
	fileName: string;
	onFileNameChange: (name: string) => void;
	onContentChange: (content: string) => void;
}

export const MarkdownPreview = ({ content, fileName, onFileNameChange, onContentChange }: MarkdownPreviewProps) => {
	const { t } = useTranslation();

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		onFileNameChange(e.target.value);
	};

	const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onContentChange(e.target.value);
	};

	return (
		<div className="w-full space-y-4">
			<h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('preview.title')}</h3>

			<div className="space-y-1.5">
				<label htmlFor="md-filename" className="text-xs text-zinc-500 dark:text-zinc-400">
					{t('preview.fileName')}
				</label>
				<div className="flex items-center gap-1.5">
					<Input id="md-filename" value={fileName} onChange={handleNameChange} className="h-7 text-sm font-medium" />
					<span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">.md</span>
				</div>
			</div>

			<div className="space-y-1.5">
				<label htmlFor="md-content" className="text-xs text-zinc-500 dark:text-zinc-400">
					{t('preview.content')}
				</label>
				<Textarea
					id="md-content"
					value={content}
					onChange={handleContentChange}
					rows={14}
					className=" text-sm leading-relaxed"
					style={{ fontFamily: 'var(--font-mono)' }}
				/>
			</div>
		</div>
	);
};
