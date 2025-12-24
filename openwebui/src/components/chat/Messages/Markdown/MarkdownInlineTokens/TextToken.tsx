import React from 'react';

interface TextTokenProps {
	text: string;
}

export default function TextToken({ text }: TextTokenProps) {
	return <span>{text}</span>;
}
