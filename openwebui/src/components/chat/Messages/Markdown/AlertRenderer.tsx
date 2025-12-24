import React, { ReactNode } from 'react';

interface AlertRendererProps {
	type?: 'info' | 'warning' | 'error' | 'success';
	children?: ReactNode;
}

export default function AlertRenderer({ type = 'info', children }: AlertRendererProps) {
	const getClassName = () => {
		switch (type) {
			case 'warning':
				return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500';
			case 'error':
				return 'bg-red-100 dark:bg-red-900/30 border-red-500';
			case 'success':
				return 'bg-green-100 dark:bg-green-900/30 border-green-500';
			default:
				return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500';
		}
	};

	return (
		<div className={`border-l-4 p-4 my-2 ${getClassName()}`}>
			{children}
		</div>
	);
}
