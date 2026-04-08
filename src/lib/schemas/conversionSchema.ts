import { z } from 'zod/v4';

import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '@/lib/fileUtils';

export const conversionRequestSchema = z.object({
	file: z
		.instanceof(File)
		.refine((f) => f.size <= MAX_FILE_SIZE_BYTES, 'File too large')
		.refine((f) => {
			const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();

			return (ACCEPTED_EXTENSIONS as readonly string[]).includes(ext);
		}, 'Invalid file type'),
});

export type ConversionRequest = z.infer<typeof conversionRequestSchema>;
