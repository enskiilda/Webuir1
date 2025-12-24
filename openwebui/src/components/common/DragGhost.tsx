import React, { useEffect, useRef, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface DragGhostProps {
	x: number;
	y: number;
	children?: ReactNode;
}

export default function DragGhost({ x, y, children }: DragGhostProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	return ReactDOM.createPortal(
		<div className="fixed top-0 left-0 w-screen h-[100dvh] z-50 touch-none pointer-events-none">
			<div className="absolute text-white z-[99999]" style={{ top: y + 10, left: x + 10 }}>
				{children}
			</div>
		</div>,
		document.body
	);
}
