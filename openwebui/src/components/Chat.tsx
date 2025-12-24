import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import { chatStream, AVAILABLE_MODELS, ModelId } from '$lib/ai';
import { createMessagesList, getMessageContentParts, removeAllDetails, copyToClipboard, getCodeBlockContents } from '$lib/utils';
import Navbar from './Navbar';
import Messages from './Messages';
import MessageInput from './MessageInput';
import Placeholder from './Placeholder';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
type HistoryMessage = { id: string; parentId: string | null; childrenIds: string[]; role: string; content: string; model?: string; modelName?: string; modelIdx?: number; timestamp: number; done?: boolean; error?: { content: string }; files?: any[]; sources?: any[]; };
type History = { messages: Record<string, HistoryMessage>; currentId: string | null };

const SUPPORTED_MODEL_IDS = Object.values(AVAILABLE_MODELS);

export default function Chat() {
	const { id: chatIdProp } = useParams<{ id?: string }>();
	const navigate = useNavigate();
	const {
		config, user, settings, models, chatId, setChatId, chatTitle, setChatTitle,
		temporaryChatEnabled, setTemporaryChatEnabled, setChats, setCurrentChatPage,
		showControls, setShowControls, setShowArtifacts, setArtifactContents,
		mobile, selectedFolder, WEBUI_NAME
	} = useStore();

	const [loading, setLoading] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [autoScroll, setAutoScroll] = useState(true);
	const [prompt, setPrompt] = useState('');
	const [files, setFiles] = useState<any[]>([]);
	const [selectedModels, setSelectedModels] = useState<string[]>(['']);
	const [history, setHistory] = useState<History>({ messages: {}, currentId: null });

	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior });
		}
	}, []);

	useEffect(() => {
		const availableModels = models.filter(m => !(m?.info?.meta?.hidden ?? false)).map(m => m.id);
		if (config?.default_models) {
			const defaultModels = config.default_models.split(',').filter(id => availableModels.includes(id));
			if (defaultModels.length > 0) {
				setSelectedModels(defaultModels);
			} else if (availableModels.length > 0) {
				setSelectedModels([availableModels[0]]);
			}
		} else if (availableModels.length > 0) {
			setSelectedModels([availableModels[0]]);
		}
	}, [models, config]);

	useEffect(() => {
		if (!chatIdProp) {
			initNewChat();
		}
	}, [chatIdProp]);

	const initNewChat = useCallback(() => {
		if (user?.role !== 'admin' && user?.permissions?.chat?.temporary_enforced) {
			setTemporaryChatEnabled(true);
		}
		setShowControls(false);
		setShowArtifacts(false);
		setChatId('');
		setChatTitle('');
		setHistory({ messages: {}, currentId: null });
		setAutoScroll(true);
		setPrompt('');
		setFiles([]);
	}, [user, setChatId, setChatTitle, setShowControls, setShowArtifacts, setTemporaryChatEnabled]);

	const submitPrompt = useCallback(async (userPrompt: string) => {
		if (userPrompt.trim() === '' && files.length === 0) {
			toast.error(t('Please enter a prompt'));
			return;
		}
		if (selectedModels.includes('') || selectedModels.length === 0) {
			toast.error(t('Model not selected'));
			return;
		}

		const modelId = selectedModels[0];
		const model = models.find(m => m.id === modelId);
		if (!model) {
			toast.error(t('Model not found'));
			return;
		}

		setPrompt('');
		const userMessageId = uuidv4();
		const responseMessageId = uuidv4();

		const messages = createMessagesList(history, history.currentId);
		const parentId = messages.length > 0 ? messages[messages.length - 1].id : null;

		const userMessage: HistoryMessage = {
			id: userMessageId,
			parentId,
			childrenIds: [responseMessageId],
			role: 'user',
			content: userPrompt,
			timestamp: Math.floor(Date.now() / 1000),
			files: files.length > 0 ? [...files] : undefined
		};

		const responseMessage: HistoryMessage = {
			id: responseMessageId,
			parentId: userMessageId,
			childrenIds: [],
			role: 'assistant',
			content: '',
			model: modelId,
			modelName: model.name ?? modelId,
			modelIdx: 0,
			timestamp: Math.floor(Date.now() / 1000),
			done: false
		};

		setHistory(prev => {
			const newMessages = { ...prev.messages };
			if (parentId && newMessages[parentId]) {
				newMessages[parentId] = { ...newMessages[parentId], childrenIds: [...newMessages[parentId].childrenIds, userMessageId] };
			}
			newMessages[userMessageId] = userMessage;
			newMessages[responseMessageId] = responseMessage;
			return { messages: newMessages, currentId: responseMessageId };
		});

		setFiles([]);
		setGenerating(true);
		scrollToBottom();

		const allMessages = [...messages, userMessage];
		const chatMessages: ChatMessage[] = allMessages.map(msg => ({
			role: msg.role as 'system' | 'user' | 'assistant',
			content: msg.content
		}));

		const controller = new AbortController();
		abortControllerRef.current = controller;

		try {
			const stream = chatStream(chatMessages, modelId as ModelId);
			for await (const chunk of stream) {
				if (controller.signal.aborted) break;
				const content = chunk.choices[0]?.delta?.content || '';
				if (content) {
					setHistory(prev => {
						const msg = prev.messages[responseMessageId];
						if (msg) {
							return {
								...prev,
								messages: { ...prev.messages, [responseMessageId]: { ...msg, content: msg.content + content } }
							};
						}
						return prev;
					});
					if (autoScroll) scrollToBottom();
				}
			}
			setHistory(prev => {
				const msg = prev.messages[responseMessageId];
				if (msg) {
					return { ...prev, messages: { ...prev.messages, [responseMessageId]: { ...msg, done: true } } };
				}
				return prev;
			});
		} catch (error: any) {
			setHistory(prev => {
				const msg = prev.messages[responseMessageId];
				if (msg) {
					return { ...prev, messages: { ...prev.messages, [responseMessageId]: { ...msg, done: true, error: { content: error.message } } } };
				}
				return prev;
			});
			toast.error(error.message);
		} finally {
			setGenerating(false);
			abortControllerRef.current = null;
		}
	}, [files, selectedModels, models, history, autoScroll, scrollToBottom]);

	const stopResponse = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			setGenerating(false);
		}
	}, []);

	const regenerateResponse = useCallback(async (message: HistoryMessage) => {
		if (!history.currentId) return;
		const userMessage = history.messages[message.parentId!];
		if (userMessage) {
			await submitPrompt(userMessage.content);
		}
	}, [history, submitPrompt]);

	const messagesList = createMessagesList(history, history.currentId);
	const showPlaceholder = messagesList.length === 0 && (settings?.landingPageMode !== 'chat' || selectedFolder);

	return (
		<div className="h-screen max-h-[100dvh] transition-width duration-200 ease-in-out w-full max-w-full flex flex-col" id="chat-container">
			<div className="w-full h-full flex flex-col">
				{(selectedFolder?.meta?.background_image_url || settings?.backgroundImageUrl || config?.license_metadata?.background_image_url) && (
					<>
						<div
							className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: `url(${selectedFolder?.meta?.background_image_url || settings?.backgroundImageUrl || config?.license_metadata?.background_image_url})` }}
						></div>
						<div className="absolute top-0 left-0 w-full h-full bg-linear-to-t from-white to-white/85 dark:from-gray-900 dark:to-gray-900/90 z-0"></div>
					</>
				)}

				<div className="h-full flex relative max-w-full flex-col">
					<Navbar
						title={chatTitle}
						selectedModels={selectedModels}
						setSelectedModels={setSelectedModels}
						initNewChat={initNewChat}
					/>

					<div className="flex flex-col flex-auto z-10 w-full @container overflow-auto">
						{!showPlaceholder ? (
							<>
								<div
									ref={messagesContainerRef}
									className="pb-2.5 flex flex-col justify-between flex-auto overflow-auto h-0 z-10 scrollbar-hidden"
									id="messages-container"
									onScroll={(e) => {
										const target = e.target as HTMLElement;
										setAutoScroll(target.scrollHeight - target.scrollTop <= target.clientHeight + 5);
									}}
								>
									<div className="h-full w-full flex flex-col">
										<Messages
											messages={messagesList}
											generating={generating}
											regenerateResponse={regenerateResponse}
										/>
									</div>
								</div>

								<div className="pb-2 z-10">
									<MessageInput
										prompt={prompt}
										setPrompt={setPrompt}
										files={files}
										setFiles={setFiles}
										generating={generating}
										stopResponse={stopResponse}
										submitPrompt={submitPrompt}
									/>
									<div className="absolute bottom-1 text-xs text-gray-500 text-center line-clamp-1 right-0 left-0"></div>
								</div>
							</>
						) : (
							<div className="flex items-center h-full">
								<Placeholder
									selectedModels={selectedModels}
									setSelectedModels={setSelectedModels}
									prompt={prompt}
									setPrompt={setPrompt}
									files={files}
									setFiles={setFiles}
									generating={generating}
									stopResponse={stopResponse}
									submitPrompt={submitPrompt}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
