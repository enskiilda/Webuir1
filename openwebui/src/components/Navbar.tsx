import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import Icon from './Icon';
import ModelSelector from './ModelSelector';

interface NavbarProps {
	title: string;
	selectedModels: string[];
	setSelectedModels: (models: string[]) => void;
	initNewChat: () => void;
}

export default function Navbar({ title, selectedModels, setSelectedModels, initNewChat }: NavbarProps) {
	const { showSidebar, setShowSidebar, temporaryChatEnabled, WEBUI_NAME, mobile } = useStore();

	return (
		<nav className="sticky top-0 flex flex-row justify-between items-center z-30 px-3 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
			<div className="flex items-center gap-1">
				{!showSidebar && (
					<button
						className="cursor-pointer flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition shrink-0 size-9"
						onClick={() => setShowSidebar(true)}
						aria-label={t('Open Sidebar')}
					>
						<Icon name="Menu" className="size-5" />
					</button>
				)}
				<Link
					to="/"
					className="flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition shrink-0 size-9"
					onClick={initNewChat}
					aria-label={t('New Chat')}
				>
					<Icon name="PencilSquare" className="size-5" />
				</Link>
			</div>

			<div className="flex-1 flex justify-center items-center gap-2 mx-2">
				<ModelSelector
					selectedModels={selectedModels}
					setSelectedModels={setSelectedModels}
				/>
				{temporaryChatEnabled && (
					<span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
						{t('Temporary')}
					</span>
				)}
			</div>

			<div className="flex items-center gap-1">
				{title && (
					<span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
						{title}
					</span>
				)}
			</div>
		</nav>
	);
}
