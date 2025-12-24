import React from 'react';

interface ErrorProps {
	content: any;
}

export default function Error({ content = '' }: ErrorProps) {
	const getErrorMessage = () => {
		if (typeof content === 'string') return content;
		if (typeof content === 'object' && content !== null) {
			if (content?.error?.message) return content.error.message;
			if (content?.detail) return content.detail;
			if (content?.message) return content.message;
			return JSON.stringify(content);
		}
		return JSON.stringify(content);
	};

	return (
		<div className="flex my-2 gap-2.5 border px-4 py-3 border-red-600/10 bg-red-600/10 rounded-lg">
			<div className="self-start mt-0.5"></div>
			<div className="self-center text-sm">
				{getErrorMessage()}
			</div>
		</div>
	);
}
