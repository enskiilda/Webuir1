import React from 'react';

interface SourceProps {
	url?: string;
	title?: string;
	idx?: number;
}

export default function Source({ url = '', title = '', idx = 0 }: SourceProps) {
	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
		>
			<span className="text-gray-500">[{idx + 1}]</span>
			<span className="truncate max-w-[200px]">{title || url}</span>
		</a>
	);
}
