import React from 'react';

interface MarkdownInlineTokensProps {
	tokens: any[];
	id?: string;
}

export default function MarkdownInlineTokens({ tokens = [], id = '' }: MarkdownInlineTokensProps) {
	return (
		<span id={id}>
			{tokens.map((token, idx) => (
				<span key={idx}>{token.raw || token.text || ''}</span>
			))}
		</span>
	);
}
