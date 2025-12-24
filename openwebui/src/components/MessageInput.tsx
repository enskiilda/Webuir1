import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import Icon from './Icon';

interface MessageInputProps {
	prompt: string;
	setPrompt: (v: string) => void;
	files: any[];
	setFiles: (v: any[]) => void;
	generating: boolean;
	stopResponse: () => void;
	submitPrompt: (prompt: string) => void;
}

export default function MessageInput({
	prompt, setPrompt, files, setFiles, generating, stopResponse, submitPrompt
}: MessageInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { settings } = useStore();

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
		}
	}, [prompt]);

	const handleSubmit = () => {
		if (generating) {
			stopResponse();
		} else if (prompt.trim() || files.length > 0) {
			submitPrompt(prompt);
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			if (settings?.ctrlEnterToSend) {
				if (e.ctrlKey || e.metaKey) {
					e.preventDefault();
					handleSubmit();
				}
			} else {
				e.preventDefault();
				handleSubmit();
			}
		}
	};

	return (
		<div className="px-3 pb-3">
			<div className="max-w-4xl mx-auto">
				<div className="relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
					{files.length > 0 && (
						<div className="absolute bottom-full left-0 mb-2 flex flex-wrap gap-2">
							{files.map((file, idx) => (
								<div key={idx} className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded px-2 py-1 text-xs">
									<span className="truncate max-w-[100px]">{file.name}</span>
									<button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-gray-600">
										<Icon name="X" className="size-3" />
									</button>
								</div>
							))}
						</div>
					)}
					<textarea
						ref={textareaRef}
						id="chat-input"
						className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-[40px] max-h-[200px] py-2 px-2"
						placeholder={t('Send a message')}
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						onKeyDown={handleKeyDown}
						rows={1}
					/>
					<button
						className={`flex-shrink-0 flex items-center justify-center size-9 rounded-xl transition ${
							generating
								? 'bg-red-500 hover:bg-red-600 text-white'
								: prompt.trim() || files.length > 0
								? 'bg-blue-600 hover:bg-blue-700 text-white'
								: 'bg-gray-200 dark:bg-gray-700 text-gray-400'
						}`}
						onClick={handleSubmit}
						disabled={!generating && !prompt.trim() && files.length === 0}
					>
						<Icon name={generating ? 'Stop' : 'Send'} className="size-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
