import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import Icon from '../../icons/Icon';
import Markdown from '../Messages/Markdown';
import Skeleton from '../Messages/Skeleton';

interface Action {
	id: string;
	label: string;
	iconName?: string;
	input?: boolean;
	prompt: string;
}

interface FloatingButtonsProps {
	id?: string;
	messageId?: string;
	model?: string | null;
	messages?: any[];
	actions?: Action[];
	onAdd?: (e: any) => void;
}

const DEFAULT_ACTIONS: Action[] = [
	{
		id: 'ask',
		label: 'Ask',
		iconName: 'ChatBubble',
		input: true,
		prompt: '{{SELECTED_CONTENT}}\n\n\n{{INPUT_CONTENT}}'
	},
	{
		id: 'explain',
		label: 'Explain',
		iconName: 'LightBulb',
		prompt: '{{SELECTED_CONTENT}}\n\n\nExplain'
	}
];

export default function FloatingButtons({
	id = '',
	messageId = '',
	model = null,
	messages = [],
	actions: propActions = [],
	onAdd = () => {}
}: FloatingButtonsProps) {
	const { chatId, socket, models } = useStore();
	const [floatingInput, setFloatingInput] = useState(false);
	const [selectedAction, setSelectedAction] = useState<Action | null>(null);
	const [selectedText, setSelectedText] = useState('');
	const [floatingInputValue, setFloatingInputValue] = useState('');
	const [content, setContent] = useState('');
	const [responseContent, setResponseContent] = useState<string | null>(null);
	const [responseDone, setResponseDone] = useState(false);
	const controllerRef = useRef<AbortController | null>(null);

	const actions = propActions.length > 0 ? propActions : DEFAULT_ACTIONS;

	const closeHandler = () => {
		if (controllerRef.current) {
			controllerRef.current.abort();
		}
		setSelectedAction(null);
		setSelectedText('');
		setResponseContent(null);
		setResponseDone(false);
		setFloatingInput(false);
		setFloatingInputValue('');
	};

	const actionHandler = async (actionId: string) => {
		if (!model) {
			toast.error(t('Model not selected'));
			return;
		}

		const selectedContent = selectedText
			.split('\n')
			.map((line) => `> ${line}`)
			.join('\n');

		const action = actions.find((a) => a.id === actionId);
		if (!action) {
			toast.error(t('Action not found'));
			return;
		}

		let prompt = action.prompt || '';

		if (prompt.includes('{{INPUT_CONTENT}}') && floatingInput) {
			prompt = prompt.replace('{{INPUT_CONTENT}}', floatingInputValue);
			setFloatingInputValue('');
		}

		prompt = prompt.replace('{{CONTENT}}', selectedText);
		prompt = prompt.replace('{{SELECTED_CONTENT}}', selectedContent);

		setContent(prompt);
		setResponseContent('');
		// Streaming would be implemented here
	};

	const addHandler = () => {
		const newMessages = [
			{ role: 'user', content: content },
			{ role: 'assistant', content: responseContent }
		];

		onAdd({
			modelId: model,
			parentId: messageId,
			messages: newMessages
		});
	};

	useEffect(() => {
		return () => {
			if (controllerRef.current) {
				controllerRef.current.abort();
			}
		};
	}, []);

	return (
		<div
			id={`floating-buttons-${id}`}
			className="absolute rounded-lg mt-1 text-xs z-[9999]"
			style={{ display: 'none' }}
		>
			{responseContent === null ? (
				!floatingInput ? (
					<div className="flex flex-row shrink-0 p-0.5 bg-white dark:bg-gray-850 dark:text-gray-100 text-medium rounded-xl shadow-xl border border-gray-100 dark:border-gray-800">
						{actions.map((action) => (
							<button
								key={action.id}
								className="px-1.5 py-[1px] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl flex items-center gap-1 min-w-fit transition"
								onClick={() => {
									setSelectedText(window.getSelection()?.toString() || '');
									setSelectedAction(action);

									if (action.prompt.includes('{{INPUT_CONTENT}}')) {
										setFloatingInput(true);
										setFloatingInputValue('');
									} else {
										actionHandler(action.id);
									}
								}}
							>
								{action.iconName && (
									<Icon name={action.iconName} className="size-3 shrink-0" />
								)}
								<div className="shrink-0">{action.label}</div>
							</button>
						))}
					</div>
				) : (
					<div className="py-1 flex dark:text-gray-100 bg-white dark:bg-gray-850 border border-gray-100 dark:border-gray-800 w-72 rounded-full shadow-xl">
						<input
							type="text"
							id="floating-message-input"
							className="ml-5 bg-transparent outline-hidden w-full flex-1 text-sm"
							placeholder={t('Ask a question')}
							value={floatingInputValue}
							onChange={(e) => setFloatingInputValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && selectedAction) {
									actionHandler(selectedAction.id);
								}
							}}
							autoFocus
						/>
						<div className="ml-1 mr-1">
							<button
								className={`${
									floatingInputValue !== ''
										? 'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100'
										: 'text-white bg-gray-200 dark:text-gray-900 dark:bg-gray-700 disabled'
								} transition rounded-full p-1.5 m-0.5 self-center`}
								onClick={() => {
									if (selectedAction) {
										actionHandler(selectedAction.id);
									}
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									className="size-4"
								>
									<path
										fillRule="evenodd"
										d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				)
			) : (
				<div className="bg-white dark:bg-gray-850 dark:text-gray-100 rounded-3xl shadow-xl w-80 max-w-full border border-gray-100 dark:border-gray-800">
					<div className="bg-white dark:bg-gray-850 dark:text-gray-100 text-medium rounded-3xl px-3.5 pt-3 w-full">
						<div className="font-medium">
							<Markdown id={`${id}-float-prompt`} content={content} />
						</div>
					</div>

					<div className="bg-white dark:bg-gray-850 dark:text-gray-100 text-medium rounded-4xl w-full">
						<div
							className="max-h-80 overflow-y-auto w-full markdown-prose-xs px-3.5 py-3"
							id="response-container"
						>
							{!responseContent || responseContent.trim() === '' ? (
								<Skeleton size="sm" />
							) : (
								<Markdown id={`${id}-float-response`} content={responseContent} />
							)}

							{responseDone && (
								<div className="flex justify-end pt-3 text-sm font-medium">
									<button
										className="px-3.5 py-1.5 text-sm font-medium bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 transition rounded-full"
										onClick={addHandler}
									>
										{t('Add')}
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
