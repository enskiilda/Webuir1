import React from 'react';
import { t } from '$lib/i18n';
import Avatar from './Avatar';
import { copyToClipboard } from '$lib/utils';
import Icon from './Icon';

interface Message {
	id: string;
	role: string;
	content: string;
	model?: string;
	modelName?: string;
	done?: boolean;
	error?: { content: string };
	timestamp: number;
}

interface MessagesProps {
	messages: Message[];
	generating: boolean;
	regenerateResponse: (message: Message) => void;
}

export default function Messages({ messages, generating, regenerateResponse }: MessagesProps) {
	return (
		<div className="flex flex-col gap-4 px-4 py-6 max-w-4xl mx-auto w-full">
			{messages.map((message, idx) => (
				<MessageItem
					key={message.id}
					message={message}
					isLast={idx === messages.length - 1}
					generating={generating && idx === messages.length - 1 && message.role === 'assistant'}
					regenerateResponse={regenerateResponse}
				/>
			))}
		</div>
	);
}

function MessageItem({ message, isLast, generating, regenerateResponse }: { message: Message; isLast: boolean; generating: boolean; regenerateResponse: (m: Message) => void }) {
	const isUser = message.role === 'user';
	const hasError = !!message.error;

	return (
		<div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
			{!isUser && (
				<div className="flex-shrink-0">
					<Avatar name={message.modelName || 'AI'} size="sm" />
				</div>
			)}
			<div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
				{!isUser && message.modelName && (
					<div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{message.modelName}</div>
				)}
				<div
					className={`rounded-2xl px-4 py-2.5 ${
						isUser
							? 'bg-blue-600 text-white'
							: hasError
							? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
					}`}
				>
					{hasError ? (
						<div className="text-sm">{message.error?.content}</div>
					) : (
						<div className="text-sm whitespace-pre-wrap break-words markdown-prose">
							{message.content || (generating ? <span className="animate-pulse">●●●</span> : '')}
						</div>
					)}
				</div>
				{!isUser && message.done && !hasError && (
					<div className="flex items-center gap-1 mt-1">
						<button
							className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
							onClick={() => copyToClipboard(message.content)}
							title={t('Copy')}
						>
							<Icon name="Copy" className="size-3.5 text-gray-400" />
						</button>
						<button
							className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition regenerate-response-button"
							onClick={() => regenerateResponse(message)}
							title={t('Regenerate')}
						>
							<Icon name="RotateCcw" className="size-3.5 text-gray-400" />
						</button>
					</div>
				)}
			</div>
			{isUser && (
				<div className="flex-shrink-0">
					<Avatar name="User" size="sm" />
				</div>
			)}
		</div>
	);
}
