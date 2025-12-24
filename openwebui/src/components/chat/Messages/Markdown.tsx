import React, { useMemo } from 'react';
import { marked } from 'marked';
import { replaceTokens, processResponseContent } from '$lib/utils';
import { useStore } from '$lib/stores';

interface MarkdownProps {
	id?: string;
	content: string;
	done?: boolean;
	model?: any;
	save?: boolean;
	preview?: boolean;
	editCodeBlock?: boolean;
	topPadding?: boolean;
	sourceIds?: string[];
	onSave?: () => void;
	onUpdate?: () => void;
	onPreview?: () => void;
	onSourceClick?: () => void;
	onTaskClick?: () => void;
}

export default function Markdown({
	id = '',
	content,
	done = true,
	model = null,
	save = false,
	preview = false,
	editCodeBlock = true,
	topPadding = false,
	sourceIds = [],
	onSave = () => {},
	onUpdate = () => {},
	onPreview = () => {},
	onSourceClick = () => {},
	onTaskClick = () => {}
}: MarkdownProps) {
	const { user } = useStore();

	const htmlContent = useMemo(() => {
		if (!content) return '';
		
		const processedContent = replaceTokens(
			processResponseContent(content),
			model?.name,
			user?.name
		);

		const options = {
			breaks: true,
			gfm: true
		};

		return marked.parse(processedContent, options);
	}, [content, model?.name, user?.name]);

	return (
		<div
			id={id}
			className={`markdown-prose dark:text-gray-100 ${topPadding ? 'pt-4' : ''}`}
			dangerouslySetInnerHTML={{ __html: htmlContent as string }}
		/>
	);
}
