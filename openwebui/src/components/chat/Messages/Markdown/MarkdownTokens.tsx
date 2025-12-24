import React from 'react';

interface MarkdownTokensProps {
	tokens: any[];
	id?: string;
}

export default function MarkdownTokens({ tokens = [], id = '' }: MarkdownTokensProps) {
	return (
		<div id={id} className="markdown-tokens">
			{tokens.map((token, idx) => (
				<div key={idx}>{token.raw || token.text || ''}</div>
			))}
		</div>
	);
}
