'use client';

import { FileText, Upload, X } from 'lucide-react';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
	ACCEPTED_EXTENSIONS,
	getFileNameWithoutExtension,
	isValidFileSize,
	isValidFileType,
	MAX_FILE_SIZE_MB,
} from '@/lib/fileUtils';
import { cn } from '@/lib/utils';

interface FileUploadProps {
	onFileSelect: (file: File, customName: string) => void;
	onClear?: () => void;
	disabled?: boolean;
}

export const FileUpload = ({ onFileSelect, onClear, disabled }: FileUploadProps) => {
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState('');
	const [isDragging, setIsDragging] = useState(false);

	const handleFile = (selectedFile: File) => {
		setError('');

		if (!isValidFileType(selectedFile)) {
			setError(t('upload.invalidFormat'));

			return;
		}

		if (!isValidFileSize(selectedFile)) {
			setError(t('upload.fileTooLarge', { size: MAX_FILE_SIZE_MB }));

			return;
		}

		const nameWithoutExt = getFileNameWithoutExtension(selectedFile.name);
		setFile(selectedFile);
		onFileSelect(selectedFile, nameWithoutExt);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			handleFile(selectedFile);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		if (!disabled) {
			setIsDragging(true);
		}
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (disabled) return;

		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile) {
			handleFile(droppedFile);
		}
	};

	const handleClear = () => {
		setFile(null);
		setError('');
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		onClear?.();
	};

	return (
		<div className="w-full space-y-4">
			{!file ? (
				<button
					type="button"
					disabled={disabled}
					onClick={() => fileInputRef.current?.click()}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={cn(
						'flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
						'border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100',
						'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800',
						isDragging && 'border-primary bg-primary/5 dark:bg-primary/10',
						disabled && 'pointer-events-none opacity-50'
					)}
				>
					<div className="rounded-full bg-zinc-200 p-3 dark:bg-zinc-800">
						<Upload className="size-5 text-zinc-500 dark:text-zinc-400" />
					</div>
					<div className="space-y-1 text-center">
						<p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t('upload.description')}</p>
						<p className="text-xs text-zinc-500 dark:text-zinc-400">{t('upload.supportedFormats')}</p>
						<p className="text-xs text-zinc-500 dark:text-zinc-400">
							{t('upload.maxSize', { size: MAX_FILE_SIZE_MB })}
						</p>
					</div>
				</button>
			) : (
				<div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
					<div className="shrink-0 rounded-lg bg-zinc-200 p-2.5 dark:bg-zinc-800">
						<FileText className="size-5 text-zinc-600 dark:text-zinc-400" />
					</div>
					<p className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{file.name}</p>
					<button
						type="button"
						onClick={handleClear}
						disabled={disabled}
						className="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
					>
						<X className="size-4" />
					</button>
				</div>
			)}

			<input
				ref={fileInputRef}
				type="file"
				accept={ACCEPTED_EXTENSIONS.join(',')}
				onChange={handleInputChange}
				className="hidden"
			/>

			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
};
