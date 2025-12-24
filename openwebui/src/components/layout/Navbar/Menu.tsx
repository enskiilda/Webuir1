import React, { useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import { copyToClipboard, createMessagesList } from '$lib/utils';
import Dropdown from '../../common/Dropdown';
import Icon from '../../icons/Icon';

interface MenuProps {
	chat?: any;
	shareHandler?: () => void;
	moveChatHandler?: () => void;
	archiveChatHandler?: () => void;
	onClose?: () => void;
	children?: ReactNode;
}

export default function Menu({
	chat,
	shareHandler,
	moveChatHandler,
	archiveChatHandler,
	onClose = () => {},
	children
}: MenuProps) {
	const { theme, temporaryChatEnabled, setTemporaryChatEnabled, showControls, setShowControls } = useStore();
	const [show, setShow] = useState(false);

	const getChatAsText = () => {
		if (!chat?.chat?.history) return '';
		const history = chat.chat.history;
		const messages = createMessagesList(history, history.currentId);
		const chatText = messages.reduce((a: string, message: any) => {
			return `${a}### ${message.role.toUpperCase()}\n${message.content}\n\n`;
		}, '');
		return chatText.trim();
	};

	const downloadTxt = async () => {
		const chatText = getChatAsText();
		const blob = new Blob([chatText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `chat-${chat?.chat?.title || 'export'}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const copyHandler = async () => {
		const chatText = getChatAsText();
		const res = await copyToClipboard(chatText);
		if (res) {
			toast.success(t('Copied to clipboard'));
		}
		setShow(false);
	};

	return (
		<Dropdown
			show={show}
			onOpenChange={setShow}
			side="bottom"
			align="end"
			className="w-56"
			trigger={children}
		>
			<div className="py-1">
				<button
					className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
					onClick={() => {
						setShowControls(!showControls);
						setShow(false);
					}}
				>
					<Icon name="AdjustmentsHorizontal" className="size-4" />
					{t('Chat Controls')}
				</button>

				<hr className="my-1 border-gray-100 dark:border-gray-700" />

				<button
					className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
					onClick={() => {
						setTemporaryChatEnabled(!temporaryChatEnabled);
						setShow(false);
					}}
				>
					{temporaryChatEnabled ? (
						<Icon name="ChatBubbleDottedChecked" className="size-4" />
					) : (
						<Icon name="ChatBubbleDotted" className="size-4" />
					)}
					{t('Temporary Chat')}
				</button>

				<hr className="my-1 border-gray-100 dark:border-gray-700" />

				{shareHandler && (
					<button
						className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => {
							shareHandler();
							setShow(false);
						}}
					>
						<Icon name="Share" className="size-4" />
						{t('Share')}
					</button>
				)}

				<button
					className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
					onClick={copyHandler}
				>
					<Icon name="Clipboard" className="size-4" />
					{t('Copy')}
				</button>

				<button
					className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
					onClick={() => {
						downloadTxt();
						setShow(false);
					}}
				>
					<Icon name="ArrowUpTray" className="size-4" />
					{t('Download')}
				</button>

				{archiveChatHandler && (
					<>
						<hr className="my-1 border-gray-100 dark:border-gray-700" />
						<button
							className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
							onClick={() => {
								archiveChatHandler();
								setShow(false);
							}}
						>
							<Icon name="ArchiveBox" className="size-4" />
							{t('Archive')}
						</button>
					</>
				)}
			</div>
		</Dropdown>
	);
}
