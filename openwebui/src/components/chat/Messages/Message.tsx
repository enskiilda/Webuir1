import React from 'react';
import { useStore } from '$lib/stores';
import ResponseMessage from './ResponseMessage';

interface MessageProps {
	chatId: string;
	selectedModels?: string[];
	history: any;
	messageId: string;
	setInputText?: (text: string) => void;
	gotoMessage?: (id: string) => void;
	showPreviousMessage?: () => void;
	showNextMessage?: () => void;
	updateChat?: () => void;
	editMessage?: (id: string, content: string) => void;
	saveMessage?: (id: string, content: string) => void;
	deleteMessage?: (id: string) => void;
	rateMessage?: (id: string, rating: number) => void;
	actionMessage?: (id: string, action: string) => void;
	submitMessage?: (id: string, content: string) => void;
	regenerateResponse?: () => void;
	continueResponse?: () => void;
	addMessages?: (messages: any[]) => void;
	readOnly?: boolean;
	editCodeBlock?: boolean;
	topPadding?: boolean;
}

export default function Message({
	chatId,
	selectedModels = [],
	history,
	messageId,
	setInputText = () => {},
	gotoMessage = () => {},
	showPreviousMessage = () => {},
	showNextMessage = () => {},
	updateChat = () => {},
	editMessage = () => {},
	saveMessage = () => {},
	deleteMessage = () => {},
	rateMessage = () => {},
	actionMessage = () => {},
	submitMessage = () => {},
	regenerateResponse = () => {},
	continueResponse = () => {},
	addMessages = () => {},
	readOnly = false,
	editCodeBlock = true,
	topPadding = false
}: MessageProps) {
	const { settings } = useStore();
	const message = history?.messages?.[messageId];

	if (!message) return null;

	const widescreenMode = settings?.widescreenMode ?? null;

	return (
		<div
			role="listitem"
			className={`flex flex-col justify-between px-4 md:px-5 lg:px-6 mb-3 w-full ${
				widescreenMode ? 'max-w-full' : 'max-w-5xl xl:max-w-6xl 2xl:max-w-7xl'
			} mx-auto rounded-lg group`}
		>
			{message.role === 'user' ? (
				<div className="flex w-full justify-end">
					<div className="max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] 2xl:max-w-[65%] rounded-2xl px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800">
						<p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap text-sm sm:text-base">
							{message.content}
						</p>
					</div>
				</div>
			) : (
				<ResponseMessage
					chatId={chatId}
					history={history}
					messageId={messageId}
					selectedModels={selectedModels}
					isLastMessage={messageId === history.currentId}
					readOnly={readOnly}
					editCodeBlock={editCodeBlock}
					topPadding={topPadding}
					regenerateResponse={regenerateResponse}
					continueResponse={continueResponse}
					editMessage={editMessage}
					deleteMessage={deleteMessage}
					rateMessage={rateMessage}
				/>
			)}
		</div>
	);
}
