import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '$lib/stores';
import Controls from './Controls/Controls';

interface ChatControlsProps {
	models?: any[];
	chatId?: string | null;
	chatFiles?: any[];
	params?: any;
	onChatFilesChange?: (files: any[]) => void;
	onParamsChange?: (params: any) => void;
}

export default function ChatControls({
	models = [],
	chatId = null,
	chatFiles = [],
	params = {},
	onChatFilesChange,
	onParamsChange
}: ChatControlsProps) {
	const { showControls, setShowControls } = useStore();
	const [largeScreen, setLargeScreen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 1024px)');

		const handleMediaQuery = (e: MediaQueryListEvent | MediaQueryList) => {
			setLargeScreen(e.matches);
		};

		handleMediaQuery(mediaQuery);
		mediaQuery.addEventListener('change', handleMediaQuery);

		return () => {
			mediaQuery.removeEventListener('change', handleMediaQuery);
		};
	}, []);

	useEffect(() => {
		if (!chatId) {
			setShowControls(false);
		}
	}, [chatId, setShowControls]);

	const closeHandler = () => {
		setShowControls(false);
	};

	if (!showControls) return null;

	if (!largeScreen) {
		return (
			<div
				className="fixed inset-0 z-50 bg-black/50"
				onClick={closeHandler}
				onKeyDown={(e) => e.key === 'Escape' && closeHandler()}
				role="button"
				tabIndex={0}
			>
				<div
					className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-850 shadow-lg"
					onClick={(e) => e.stopPropagation()}
					role="dialog"
					aria-modal="true"
				>
					<div className="px-4 py-3 h-full">
						<Controls
							models={models}
							chatFiles={chatFiles}
							params={params}
							onClose={closeHandler}
							onChatFilesChange={onChatFilesChange}
							onParamsChange={onParamsChange}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div ref={containerRef} className="flex max-h-full min-h-full">
			<div
				className="w-80 px-4 py-3 bg-white dark:shadow-lg dark:bg-gray-850 z-40 pointer-events-auto overflow-y-auto scrollbar-hidden border-l border-gray-50 dark:border-gray-850"
				id="controls-container"
			>
				<Controls
					models={models}
					chatFiles={chatFiles}
					params={params}
					onClose={closeHandler}
					onChatFilesChange={onChatFilesChange}
					onParamsChange={onParamsChange}
				/>
			</div>
		</div>
	);
}
