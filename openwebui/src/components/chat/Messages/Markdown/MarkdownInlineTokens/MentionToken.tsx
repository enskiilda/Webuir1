import React from 'react';

interface MentionTokenProps {
	mention: string;
	triggerChar?: string;
}

export default function MentionToken({ mention, triggerChar = '@' }: MentionTokenProps) {
	return (
		<span className="text-blue-500 font-medium cursor-pointer hover:underline">
			{triggerChar}{mention}
		</span>
	);
}
