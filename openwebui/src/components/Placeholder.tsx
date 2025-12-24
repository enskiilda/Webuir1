import React from 'react';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import ModelSelector from './ModelSelector';
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
	const { config, WEBUI_NAME } = useStore();
	const suggestions = config?.default_prompt_suggestions || [];

	const handleSuggestionClick = (content: string) => {
		submitPrompt(content);
	};

	return (
		<div className="flex flex-col items-center justify-center w-full h-full p-4">
			<div className="max-w-2xl w-full flex flex-col items-center gap-8">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
						{WEBUI_NAME}
					</h1>
					<p className="text-gray-500 dark:text-gray-400">
						{t('How can I help you today?')}
					</p>
				</div>

				<div className="w-full">
					<ModelSelector selectedModels={selectedModels} setSelectedModels={setSelectedModels} />
				</div>

				{suggestions.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
						{suggestions.slice(0, 4).map((suggestion, idx) => (
							<button
								key={idx}
								className="text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
								onClick={() => handleSuggestionClick(suggestion.content)}
							>
								<div className="font-medium text-gray-900 dark:text-white text-sm">
									{suggestion.title[0]}
								</div>
								<div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
									{suggestion.title[1]}
								</div>
							</button>
						))}
					</div>
				)}

				<div className="w-full">
					<MessageInput
						prompt={prompt}
						setPrompt={setPrompt}
						files={files}
						setFiles={setFiles}
						generating={generating}
						stopResponse={stopResponse}
						submitPrompt={submitPrompt}
					/>
				</div>
			</div>
		</div>
	);
}
