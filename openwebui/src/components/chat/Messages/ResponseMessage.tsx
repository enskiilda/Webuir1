import React from 'react';
import { useStore } from '$lib/stores';
import Markdown from './Markdown';
import ProfileImage from './ProfileImage';

interface ResponseMessageProps {
	chatId: string;
	history: any;
	messageId: string;
	selectedModels?: string[];
	isLastMessage?: boolean;
	readOnly?: boolean;
	editCodeBlock?: boolean;
	topPadding?: boolean;
	regenerateResponse?: () => void;
	continueResponse?: () => void;
	editMessage?: (id: string, content: string) => void;
	deleteMessage?: (id: string) => void;
	rateMessage?: (id: string, rating: number) => void;
}

export default function ResponseMessage({
	chatId,
	history,
	messageId,
	selectedModels = [],
	isLastMessage = false,
	readOnly = false,
	editCodeBlock = true,
	topPadding = false,
	regenerateResponse = () => {},
	continueResponse = () => {},
	editMessage = () => {},
	deleteMessage = () => {},
	rateMessage = () => {}
}: ResponseMessageProps) {
	const { models, settings } = useStore();
	const message = history?.messages?.[messageId];

	if (!message) return null;

	const model = models.find((m: any) => m.id === message.model);

	return (
		<div className="flex gap-4 w-full">
			<div className="flex-shrink-0">
				<ProfileImage className="size-8" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
						{model?.name || message.model || 'Assistant'}
					</span>
				</div>

				<div className="prose dark:prose-invert max-w-none">
					{message.error ? (
						<div className="flex my-2 gap-2.5 border px-4 py-3 border-red-600/10 bg-red-600/10 rounded-lg">
							<div className="self-center text-sm text-red-600">
								{typeof message.error === 'string' 
									? message.error 
									: message.error?.message || JSON.stringify(message.error)
								}
							</div>
						</div>
					) : (
						<Markdown
							id={`${chatId}-${messageId}`}
							content={message.content || ''}
							model={model}
							editCodeBlock={editCodeBlock}
							topPadding={topPadding}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
