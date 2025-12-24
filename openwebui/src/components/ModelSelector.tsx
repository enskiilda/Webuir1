import React, { useState, useRef } from 'react';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import Icon from './Icon';

interface ModelSelectorProps {
	selectedModels: string[];
	setSelectedModels: (models: string[]) => void;
}

export default function ModelSelector({ selectedModels, setSelectedModels }: ModelSelectorProps) {
	const { models } = useStore();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectedModel = models.find(m => m.id === selectedModels[0]);

	const handleSelect = (modelId: string) => {
		setSelectedModels([modelId]);
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				id="model-selector-0-button"
				className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm font-medium"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="truncate max-w-[200px]">
					{selectedModel?.name || t('Select a model')}
				</span>
				<Icon name="ChevronDown" className="size-4" />
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 mt-1 w-64 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
					<div className="p-1">
						{models.filter(m => !(m?.info?.meta?.hidden ?? false)).map((model) => (
							<button
								key={model.id}
								className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
									selectedModels.includes(model.id) ? 'bg-gray-100 dark:bg-gray-700' : ''
								}`}
								onClick={() => handleSelect(model.id)}
							>
								<div className="font-medium">{model.name}</div>
									{'source' in model && (
						<div className="text-xs text-gray-500 dark:text-gray-400">{'source' in model ? (model as any).source : ''}</div>
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
