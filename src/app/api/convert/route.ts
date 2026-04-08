import mammoth from 'mammoth';
import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';
import WordExtractor from 'word-extractor';

import { MAX_FILE_SIZE_BYTES, ACCEPTED_EXTENSIONS } from '@/lib/fileUtils';
import { htmlToMarkdown } from '@/lib/htmlToMarkdown';

export const POST = async (request: NextRequest) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || !(file instanceof File)) {
			return NextResponse.json({ error: 'NO_FILE' }, { status: 400 });
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			return NextResponse.json({ error: 'FILE_TOO_LARGE' }, { status: 400 });
		}

		const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
		if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)) {
			return NextResponse.json({ error: 'INVALID_TYPE' }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const markdownContent = await extractToMarkdown(buffer, ext);

		return NextResponse.json({ markdown: markdownContent });
	} catch (error) {
		console.error('Conversion error:', error);

		return NextResponse.json({ error: 'CONVERSION_FAILED' }, { status: 500 });
	}
};

const extractToMarkdown = (buffer: Buffer, ext: string): Promise<string> => {
	switch (ext) {
		case '.pdf':
			return extractPdf(buffer);
		case '.doc':
			return extractDoc(buffer);
		case '.docx':
			return extractDocx(buffer);
		default:
			throw new Error(`Unsupported file type: ${ext}`);
	}
};

const extractPdf = async (buffer: Buffer): Promise<string> => {
	const pdfParse = new PDFParse({ data: new Uint8Array(buffer) });
	const data = await pdfParse.getText();
	const text = data.text;

	// pdf-parse returns plain text — apply heuristics to recover structure
	return structurePlainText(text);
};

const extractDocx = async (buffer: Buffer): Promise<string> => {
	const result = await mammoth.convertToHtml({ buffer });

	return htmlToMarkdown(result.value);
};

const extractDoc = async (buffer: Buffer): Promise<string> => {
	const extractor = new WordExtractor();
	const document = await extractor.extract(buffer);
	const text = document.getBody();

	return structurePlainText(text);
};

const structurePlainText = (text: string): string => {
	const lines = text.split('\n');
	const output: string[] = [];

	for (const rawLine of lines) {
		const line = rawLine.trimEnd();

		if (!line.trim()) {
			output.push('');
			continue;
		}

		const trimmed = line.trim();
		const hasLeadingSpace = /^\s+/.test(line) && !line.startsWith('  '); // single indent = likely list item from PDF
		const hasDeepIndent = /^\s{2,}/.test(line); // continuation or nested content

		// Detect likely headings: short lines, all caps or ending without punctuation
		const isShortLine = trimmed.length < 80;
		const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
		const lacksEndPunctuation = !/[.,:;!?]$/.test(trimmed);

		// Check if previous output line is a list item (for continuation detection)
		const prevLine = output.length > 0 ? output[output.length - 1] : '';
		const prevIsList = /^- /.test(prevLine) || /^\d+\. /.test(prevLine);

		if (isShortLine && isAllCaps && trimmed.length > 1) {
			output.push(`## ${toTitleCase(trimmed)}`);
			output.push('');
		} else if (/^[•●○▪▸▹►◦⁃–—-]\s/.test(trimmed)) {
			// Bullet list items
			output.push(`- ${trimmed.replace(/^[•●○▪▸▹►◦⁃–—-]\s*/, '')}`);
		} else if (/^\d+[.):]\s/.test(trimmed)) {
			// Numbered list items — normalize to "N. " format for valid markdown
			output.push(trimmed.replace(/^(\d+)[.):]\s*/, '$1. '));
		} else if (/^[a-zA-Z][.)]\s/.test(trimmed)) {
			// Lettered list items (a. item, b) item)
			output.push(`- ${trimmed.replace(/^[a-zA-Z][.)]\s*/, '')}`);
		} else if (hasLeadingSpace && !hasDeepIndent) {
			// PDF-extracted list item (bullet character was stripped, leaving a leading space)
			output.push(`- ${trimmed}`);
		} else if (
			prevIsList &&
			!hasLeadingSpace &&
			!isAllCaps &&
			!/^[•●○▪▸▹►◦⁃–—-]\s/.test(trimmed) &&
			!/^\d+[.):]\s/.test(trimmed)
		) {
			// Continuation of previous list item (wrapped line)
			output[output.length - 1] += ` ${trimmed}`;
		} else if (isShortLine && lacksEndPunctuation) {
			// Potential subheading — only if preceded by blank line
			const prevNonEmpty = output.findLast((l) => l.trim() !== '');
			if (!prevNonEmpty || prevNonEmpty === '') {
				output.push(`### ${trimmed}`);
				output.push('');
			} else {
				output.push(trimmed);
			}
		} else {
			output.push(trimmed);
		}
	}

	// Clean up excessive blank lines
	return output
		.join('\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
};

const toTitleCase = (str: string): string => {
	return str
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
