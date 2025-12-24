import React, { useEffect, useRef, ReactNode, useState } from 'react';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
	containerClassName?: string;
	className?: string;
	children?: ReactNode;
}

const sizeToWidth = (size: string) => {
	if (size === 'full') return 'w-full';
	if (size === 'xs') return 'w-[16rem]';
	if (size === 'sm') return 'w-[30rem]';
	if (size === 'md') return 'w-[42rem]';
	if (size === 'lg') return 'w-[56rem]';
	if (size === 'xl') return 'w-[70rem]';
	if (size === '2xl') return 'w-[84rem]';
	if (size === '3xl') return 'w-[100rem]';
	return 'w-[56rem]';
};

export default function Modal({
	show,
	onClose,
	size = 'md',
	containerClassName = 'p-3',
	className = 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-4xl',
	children
}: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		if (show) {
			window.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'unset';
		};
	}, [show, onClose]);

	if (!show || !mounted) return null;

	return (
		<div
			ref={modalRef}
			aria-modal="true"
			role="dialog"
			className={`modal fixed top-0 right-0 left-0 bottom-0 bg-black/30 dark:bg-black/60 w-full h-screen max-h-[100dvh] ${containerClassName} flex justify-center z-[9999] overflow-y-auto overscroll-contain`}
			style={{ scrollbarGutter: 'stable' }}
			onMouseDown={() => onClose()}
		>
			<div
				className={`m-auto max-w-full ${sizeToWidth(size)} ${size !== 'full' ? 'mx-2' : ''} shadow-3xl min-h-fit scrollbar-hidden ${className} border border-white dark:border-gray-850`}
				onMouseDown={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}
