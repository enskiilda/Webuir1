import React, { useEffect, useRef, ReactNode } from 'react';

interface LoaderProps {
	children?: ReactNode;
	onVisible?: () => void;
}

export default function Loader({ children, onVisible }: LoaderProps) {
	const loaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let intervalId: ReturnType<typeof setInterval> | null = null;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						intervalId = setInterval(() => {
							onVisible?.();
						}, 100);
					} else {
						if (intervalId) {
							clearInterval(intervalId);
						}
					}
				});
			},
			{
				root: null,
				rootMargin: '0px',
				threshold: 0.1
			}
		);

		if (loaderRef.current) {
			observer.observe(loaderRef.current);
		}

		return () => {
			observer.disconnect();
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [onVisible]);

	return <div ref={loaderRef}>{children}</div>;
}
