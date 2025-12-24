import React from 'react';

export default function Avatar({ name, size = 'md' }: { name?: string; size?: 'sm' | 'md' | 'lg' }) {
	const sizeClasses = { sm: 'size-6 text-xs', md: 'size-8 text-sm', lg: 'size-10 text-base' };
	const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
	
	return (
		<div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300`}>
			{initials}
		</div>
	);
}
