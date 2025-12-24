import React from 'react';

interface SourceTokenProps {
	id?: string;
	title?: string;
}

export default function SourceToken({ id = '', title = '' }: SourceTokenProps) {
	return (
		<sup className="text-xs text-blue-500 cursor-pointer hover:underline">
			[{id}]
		</sup>
	);
}
