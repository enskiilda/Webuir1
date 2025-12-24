import React from 'react';

interface SkeletonProps {
	size?: 'xs' | 'sm' | 'md';
}

export default function Skeleton({ size = 'md' }: SkeletonProps) {
	const getContainerClass = () => {
		if (size === 'md') return 'size-4 my-2';
		if (size === 'xs') return 'size-2 my-1';
		return 'size-3 my-1';
	};

	const getDotClass = () => {
		if (size === 'md') return 'size-4';
		if (size === 'xs') return 'size-2';
		return 'size-3';
	};

	return (
		<>
			<span className={`flex ${getContainerClass()} mx-1`}>
				<span className={`inline-flex ${getDotClass()} rounded-full bg-gray-800 dark:bg-white animate-breathe`}></span>
			</span>

			<style>{`
				@keyframes breathe {
					0%, 100% {
						transform: scale(0.6);
						opacity: 0.7;
					}
					50% {
						transform: scale(1);
						opacity: 1;
					}
				}

				.animate-breathe {
					animation: breathe 1.2s ease-in-out infinite;
				}
			`}</style>
		</>
	);
}
