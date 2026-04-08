export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = {
	'application/pdf': ['.pdf'],
	'application/msword': ['.doc'],
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
} as const;

export const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

export const isValidFileType = (file: File): boolean => {
	return Object.keys(ACCEPTED_FILE_TYPES).includes(file.type);
};

export const isValidFileSize = (file: File): boolean => {
	return file.size <= MAX_FILE_SIZE_BYTES;
};

export const getFileNameWithoutExtension = (fileName: string): string => {
	const lastDot = fileName.lastIndexOf('.');

	return lastDot > 0 ? fileName.substring(0, lastDot) : fileName;
};

export const getFileExtension = (fileName: string): string => {
	const lastDot = fileName.lastIndexOf('.');

	return lastDot > 0 ? fileName.substring(lastDot) : '';
};
