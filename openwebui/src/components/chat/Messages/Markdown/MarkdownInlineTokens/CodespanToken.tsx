import React from 'react';

interface CodespanTokenProps {
	code: string;
}

export default function CodespanToken({ code }: CodespanTokenProps) {
	return (
		<code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
			{code}
		</code>
	);
}
