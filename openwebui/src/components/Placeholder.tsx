import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import { WEBUI_VERSION } from '$lib/constants';
import MessageInput from './MessageInput';

interface PlaceholderProps {
	selectedModels: string[];
	setSelectedModels: (models: string[]) => void;
	prompt: string;
	setPrompt: (v: string) => void;
	files: any[];
	setFiles: (v: any[]) => void;
	generating: boolean;
	stopResponse: () => void;
	submitPrompt: (prompt: string) => void;
}

export default function Placeholder({
	selectedModels, setSelectedModels, prompt, setPrompt, files, setFiles, generating, stopResponse, submitPrompt
}: PlaceholderProps) {
	const { config, user, models, mobile, temporaryChatEnabled, settings, WEBUI_NAME } = useStore();
	const suggestionPrompts = config?.default_prompt_suggestions || [];
	
	const selectedModel = models.find(m => m.id === selectedModels[0]);

	const [sortedPrompts, setSortedPrompts] = useState<any[]>([]);

	useEffect(() => {
		if (suggestionPrompts.length > 0) {
			setSortedPrompts([...suggestionPrompts].sort(() => Math.random() - 0.5));
		}
	}, [suggestionPrompts]);

	const fuse = useMemo(() => new Fuse(sortedPrompts, { keys: ['content', 'title'], threshold: 0.5 }), [sortedPrompts]);

	const filteredPrompts = useMemo(() => {
		if (prompt.length > 500) return [];
		if (prompt.trim() && fuse) {
			return fuse.search(prompt.trim()).map((result: any) => result.item);
		}
		return sortedPrompts;
	}, [prompt, fuse, sortedPrompts]);

	const handleSuggestionClick = (content: string) => {
		submitPrompt(content);
	};

	if (mobile) {
		return (
			<div className="flex flex-col h-full w-full">
				<div className="flex-1 flex flex-col justify-center overflow-auto px-2 text-center">
					{temporaryChatEnabled && (
						<div className="flex items-center justify-center gap-2 text-gray-500 text-base my-2 w-fit mx-auto">
							{t('Temporary Chat')}
						</div>
					)}

					<div className="w-full text-3xl text-gray-800 dark:text-gray-100 text-center flex items-center gap-4 font-primary">
						<div className="w-full flex flex-col justify-center items-center">
							<div className="flex flex-row justify-center gap-3 w-fit px-5 max-w-xl">
								<div className="text-3xl line-clamp-1 flex items-center">
									{selectedModel?.name ? (
										<span className="line-clamp-1">{selectedModel.name}</span>
									) : (
										t('Hello, {{name}}', { name: user?.name || 'User' })
									)}
								</div>
							</div>

							<div className="flex mt-1 mb-2">
								<div>
									{selectedModel?.info?.meta?.description && (
										<div className="mt-0.5 px-2 text-sm font-normal text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xl markdown">
											{selectedModel.info.meta.description}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="mx-auto max-w-2xl font-primary mt-4">
						<div className="mx-4 md:mx-5 lg:mx-6">
							<Suggestions
								filteredPrompts={filteredPrompts}
								onSelect={handleSuggestionClick}
								webuiName={WEBUI_NAME}
								settings={settings}
							/>
						</div>
					</div>
				</div>

				<div className="flex-shrink-0 w-full px-2 pb-2 pt-2 bg-white dark:bg-gray-900">
					<div className="text-base font-normal w-full">
						<MessageInput
							prompt={prompt}
							setPrompt={setPrompt}
							files={files}
							setFiles={setFiles}
							generating={generating}
							stopResponse={stopResponse}
							submitPrompt={submitPrompt}
							placeholder={t('How can I help you today?')}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="m-auto w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-20 text-center">
			{temporaryChatEnabled && (
				<div className="flex items-center gap-2 text-gray-500 text-base my-2 w-fit">
					{t('Temporary Chat')}
				</div>
			)}

			<div className="w-full text-3xl text-gray-800 dark:text-gray-100 text-center flex items-center gap-4 font-primary">
				<div className="w-full flex flex-col justify-center items-center">
					<div className="flex flex-row justify-center gap-3 @sm:gap-3.5 w-fit px-5 max-w-xl">
						<div className="text-3xl @sm:text-3xl line-clamp-1 flex items-center">
							{selectedModel?.name ? (
								<span className="line-clamp-1">{selectedModel.name}</span>
							) : (
								t('Hello, {{name}}', { name: user?.name || 'User' })
							)}
						</div>
					</div>

					<div className="flex mt-1 mb-2">
						<div>
							{selectedModel?.info?.meta?.description && (
								<>
									<div className="mt-0.5 px-2 text-sm font-normal text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xl markdown">
										{selectedModel.info.meta.description}
									</div>
									{selectedModel?.info?.meta?.user && (
										<div className="mt-0.5 text-sm font-normal text-gray-400 dark:text-gray-500">
											By {selectedModel.info.meta.user.name || `@${selectedModel.info.meta.user.username}`}
										</div>
									)}
								</>
							)}
						</div>
					</div>

					<div className={`text-base font-normal @md:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl w-full py-3`}>
						<MessageInput
							prompt={prompt}
							setPrompt={setPrompt}
							files={files}
							setFiles={setFiles}
							generating={generating}
							stopResponse={stopResponse}
							submitPrompt={submitPrompt}
							placeholder={t('How can I help you today?')}
						/>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-2xl xl:max-w-3xl 2xl:max-w-4xl font-primary mt-2">
				<div className="mx-4 md:mx-5 lg:mx-6">
					<Suggestions
						filteredPrompts={filteredPrompts}
						onSelect={handleSuggestionClick}
						webuiName={WEBUI_NAME}
						settings={settings}
					/>
				</div>
			</div>
		</div>
	);
}

function Suggestions({ filteredPrompts, onSelect, webuiName, settings }: { filteredPrompts: any[]; onSelect: (content: string) => void; webuiName: string; settings: any }) {
	return (
		<>
			<div className="mb-1 flex gap-1 text-xs font-medium items-center text-gray-600 dark:text-gray-400">
				{filteredPrompts.length > 0 ? (
					t('Suggested')
				) : (
					<div className={`flex w-full ${settings?.landingPageMode === 'chat' ? ' -mt-1' : 'text-center items-center justify-center'} self-start text-gray-600 dark:text-gray-400`}>
						{webuiName} ‧ v{WEBUI_VERSION}
					</div>
				)}
			</div>

			<div className="h-40 w-full">
				{filteredPrompts.length > 0 && (
					<div role="list" className="max-h-40 overflow-auto scrollbar-none items-start">
						{filteredPrompts.map((prompt: any, idx: number) => (
							<button
								key={prompt.id || `${prompt.content}-${idx}`}
								role="listitem"
								className="waterfall flex flex-col flex-1 shrink-0 w-full justify-between px-3 py-2 rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition group"
								style={{ animationDelay: `${idx * 60}ms` }}
								onClick={() => onSelect(prompt.content)}
							>
								<div className="flex flex-col text-left">
									{prompt.title && prompt.title[0] !== '' ? (
										<>
											<div className="font-medium dark:text-gray-300 dark:group-hover:text-gray-200 transition line-clamp-1">
												{prompt.title[0]}
											</div>
											<div className="text-xs text-gray-600 dark:text-gray-400 font-normal line-clamp-1">
												{prompt.title[1]}
											</div>
										</>
									) : (
										<>
											<div className="font-medium dark:text-gray-300 dark:group-hover:text-gray-200 transition line-clamp-1">
												{prompt.content}
											</div>
											<div className="text-xs text-gray-600 dark:text-gray-400 font-normal line-clamp-1">
												{t('Prompt')}
											</div>
										</>
									)}
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		</>
	);
}
