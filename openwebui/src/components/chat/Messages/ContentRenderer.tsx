import React, { ReactNode } from 'react';

interface ContentRendererProps {
	id?: string;
	content?: string;
	children?: ReactNode;
}

export default function ContentRenderer({ id = '', content = '', children }: ContentRendererProps) {
	return (
		<div id={id} className="content-renderer">
			{children || content}
		</div>
	);
}
