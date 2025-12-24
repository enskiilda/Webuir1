import React, { useState, useEffect } from 'react';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import { WEBUI_VERSION } from '$lib/constants';
import { WEBUI_API_BASE_URL } from '$lib/constants';
import Suggestions from './Suggestions';

interface ChatPlaceholderProps {
	modelIds?: string[];
	models?: any[];
	atSelectedModel?: any;
	onSelect?: (e: any) => void;
}

export default function ChatPlaceholder({
	modelIds = [],
	models: propModels = [],
	atSelectedModel,
	onSelect = () => {}
}: ChatPlaceholderProps) {
	const { user, models: storeModels, temporaryChatEnabled } = useStore();
	const [mounted, setMounted] = useState(false);
	const [selectedModelIdx, setSelectedModelIdx] = useState(0);

	const models = modelIds.map((id) => storeModels.find((m: any) => m.id === id) || propModels.find((m: any) => m.id === id));

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (modelIds.length > 0) {
			setSelectedModelIdx(models.length - 1);
		}
	}, [modelIds, models.length]);

	if (!mounted) return null;

	return (
		<div className="m-auto w-full max-w-6xl px-8 lg:px-20">
			<div className="flex justify-start">
				<div className="flex -space-x-4 mb-0.5">
					{models.map((model, modelIdx) => (
						<button key={modelIdx} onClick={() => setSelectedModelIdx(modelIdx)}>
							<img
								src={`${WEBUI_API_BASE_URL}/models/model/profile/image?id=${model?.id}&lang=pl`}
								className="size-[2.7rem] rounded-full border-[1px] border-gray-100 dark:border-none"
								alt="logo"
								draggable={false}
							/>
						</button>
					))}
				</div>
			</div>

			{temporaryChatEnabled && (
				<div className="flex items-center gap-2 text-gray-500 text-lg mt-2 w-fit">
					{t('Temporary Chat')}
				</div>
			)}

			<div className="mt-2 mb-4 text-3xl text-gray-800 dark:text-gray-100 text-left flex items-center gap-4 font-primary">
				<div>
					<div className="capitalize line-clamp-1">
						{models[selectedModelIdx]?.name || t('Hello, {{name}}', { name: user?.name })}
					</div>
				</div>
			</div>

			<Suggestions
				suggestionPrompts={models[selectedModelIdx]?.info?.meta?.suggestion_prompts || []}
				onSelect={onSelect}
			/>
		</div>
	);
}
