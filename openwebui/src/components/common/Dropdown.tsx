import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownProps {
	show?: boolean;
	onOpenChange?: (open: boolean) => void;
	side?: 'bottom' | 'top' | 'left' | 'right';
	align?: 'start' | 'center' | 'end';
	closeOnOutsideClick?: boolean;
	className?: string;
	trigger: ReactNode;
	children?: ReactNode;
}

export default function Dropdown({
	show: controlledShow,
	onOpenChange,
	side = 'bottom',
	align = 'start',
	closeOnOutsideClick = true,
	className = 'min-w-[160px]',
	trigger,
	children
}: DropdownProps) {
	const [internalShow, setInternalShow] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const show = controlledShow !== undefined ? controlledShow : internalShow;

	const setShow = (value: boolean) => {
		if (controlledShow === undefined) {
			setInternalShow(value);
		}
		onOpenChange?.(value);
	};

	useEffect(() => {
		if (!closeOnOutsideClick) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setShow(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [closeOnOutsideClick]);

	const getPositionClasses = () => {
		const positions: Record<string, string> = {
			'bottom-start': 'top-full left-0 mt-1',
			'bottom-center': 'top-full left-1/2 -translate-x-1/2 mt-1',
			'bottom-end': 'top-full right-0 mt-1',
			'top-start': 'bottom-full left-0 mb-1',
			'top-center': 'bottom-full left-1/2 -translate-x-1/2 mb-1',
			'top-end': 'bottom-full right-0 mb-1',
		};
		return positions[`${side}-${align}`] || positions['bottom-start'];
	};

	return (
		<div ref={containerRef} className="relative inline-block">
			<div onClick={() => setShow(!show)}>
				{trigger}
			</div>

			{show && (
				<div className={`absolute ${getPositionClasses()} ${className} z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700`}>
					{children}
				</div>
			)}
		</div>
	);
}
