const escapeMarkdown = (text: string): string => {
	return text.replace(/([\\`*_{}[\]()#+\-.!|])/g, '\\$1');
};

const htmlToMarkdown = (html: string): string => {
	let md = html;

	// Handle headings (h1-h6)
	for (let i = 1; i <= 6; i++) {
		const hashes = '#'.repeat(i);
		const regex = new RegExp(`<h${i}[^>]*>(.*?)<\\/h${i}>`, 'gi');
		md = md.replace(regex, (_, content) => `\n${hashes} ${stripTags(content).trim()}\n`);
	}

	// Handle bold
	md = md.replace(/<(strong|b)>(.*?)<\/\1>/gi, (_, _tag, content) => `**${stripTags(content)}**`);

	// Handle italic
	md = md.replace(/<(em|i)>(.*?)<\/\1>/gi, (_, _tag, content) => `*${stripTags(content)}*`);

	// Handle unordered lists
	md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
		const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];

		return (
			'\n' + items.map((item: string) => `- ${stripTags(item.replace(/<\/?li[^>]*>/gi, '')).trim()}`).join('\n') + '\n'
		);
	});

	// Handle ordered lists
	md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
		const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];

		return (
			'\n' +
			items
				.map((item: string, idx: number) => `${idx + 1}. ${stripTags(item.replace(/<\/?li[^>]*>/gi, '')).trim()}`)
				.join('\n') +
			'\n'
		);
	});

	// Handle blockquotes
	md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
		const lines = stripTags(content)
			.trim()
			.split('\n')
			.map((line: string) => `> ${line.trim()}`);

		return '\n' + lines.join('\n') + '\n';
	});

	// Handle line breaks and paragraphs
	md = md.replace(/<br\s*\/?>/gi, '\n');
	md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => `\n${stripTags(content).trim()}\n`);

	// Handle horizontal rules
	md = md.replace(/<hr\s*\/?>/gi, '\n---\n');

	// Handle links
	md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (_, href, text) => `[${stripTags(text)}](${href})`);

	// Handle tables
	md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, tableContent) => {
		return convertTableToMarkdown(tableContent);
	});

	// Handle code blocks
	md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, content) => {
		return `\n\`\`\`\n${stripTags(content).trim()}\n\`\`\`\n`;
	});

	// Handle inline code
	md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, (_, content) => `\`${stripTags(content)}\``);

	// Strip remaining HTML tags
	md = stripTags(md);

	// Clean up excessive blank lines
	md = md.replace(/\n{3,}/g, '\n\n');

	return md.trim();
};

const stripTags = (html: string): string => {
	return html.replace(/<[^>]*>/g, '');
};

const convertTableToMarkdown = (tableHtml: string): string => {
	const rows: string[][] = [];
	const rowMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];

	for (const row of rowMatches) {
		const cells = (row.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || []).map((cell) =>
			stripTags(cell.replace(/<\/?(td|th)[^>]*>/gi, '')).trim()
		);
		rows.push(cells);
	}

	if (rows.length === 0) return '';

	const maxCols = Math.max(...rows.map((r) => r.length));
	const normalizedRows = rows.map((r) => {
		while (r.length < maxCols) r.push('');

		return r;
	});

	const lines: string[] = [];
	lines.push('| ' + normalizedRows[0].join(' | ') + ' |');
	lines.push('| ' + normalizedRows[0].map(() => '---').join(' | ') + ' |');

	for (let i = 1; i < normalizedRows.length; i++) {
		lines.push('| ' + normalizedRows[i].join(' | ') + ' |');
	}

	return '\n' + lines.join('\n') + '\n';
};

export { escapeMarkdown, htmlToMarkdown };
