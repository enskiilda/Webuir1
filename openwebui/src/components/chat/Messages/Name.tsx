import React, { ReactNode } from 'react';

interface NameProps {
	children?: ReactNode;
}

export default function Name({ children }: NameProps) {
	return (
		<div className="self-center font-semibold line-clamp-1 flex gap-1 items-center">
			{children}
		</div>
	);
}
