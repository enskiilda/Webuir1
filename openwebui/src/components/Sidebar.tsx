import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import Icon from './Icon';
import Avatar from './Avatar';

export default function Sidebar() {
	const navigate = useNavigate();
	const {
		showSidebar, setShowSidebar, mobile, user, WEBUI_NAME,
		chats, pinnedChats, showSearch, setShowSearch,
		setTemporaryChatEnabled, setSelectedFolder, setChatId
	} = useStore();
	const scrollTop = useRef(0);

	const newChatHandler = () => {
		setSelectedFolder(null);
		if (user?.role !== 'admin' && user?.permissions?.chat?.temporary_enforced) {
			setTemporaryChatEnabled(true);
		} else {
			setTemporaryChatEnabled(false);
		}
		if (mobile) {
			setTimeout(() => setShowSidebar(false), 0);
		}
	};

	const itemClickHandler = () => {
		setChatId('');
		if (mobile) setShowSidebar(false);
	};

	if (!showSidebar && mobile) return null;

	return (
		<div
			id="sidebar"
			className={`h-screen max-h-[100dvh] min-h-screen select-none flex-shrink-0 ${showSidebar ? 'w-[260px]' : 'w-[48px]'} ${showSidebar ? 'bg-[#f9f9f9] dark:bg-[#181818]' : 'bg-white dark:bg-[#212121]'} border-e border-[#f5f5f5] dark:border-[#2e2e2e] text-gray-900 dark:text-gray-200 text-sm overflow-x-hidden transition-all duration-500 ease-in-out ${mobile ? 'fixed left-0 top-0 z-50' : ''} ${mobile ? (showSidebar ? 'translate-x-0' : '-translate-x-full') : ''}`}
			data-state={showSidebar}
		>
			<div className={`flex flex-col justify-between h-screen max-h-[100dvh] ${showSidebar ? 'w-[260px]' : 'w-[48px]'} overflow-x-hidden scrollbar-hidden z-50`}>
				<div className="sidebar px-1.5 pt-1.5 pb-1.5 flex flex-col text-gray-600 dark:text-gray-400 sticky top-0 z-10">
					<div className="flex items-center">
						<button
							className="cursor-pointer flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition no-drag-region shrink-0 size-9"
							onClick={() => setShowSidebar(!showSidebar)}
							aria-label={showSidebar ? t('Close Sidebar') : t('Open Sidebar')}
						>
							<div className="flex items-center justify-center size-9 shrink-0">
								<Icon name="Menu" />
							</div>
						</button>
						{showSidebar && (
							<Link to="/" className="flex flex-1 items-center px-1.5 mt-0.5" onClick={newChatHandler}>
								<div id="sidebar-webui-name" className="text-base font-medium text-gray-850 dark:text-white font-primary">
									{WEBUI_NAME}
								</div>
							</Link>
						)}
					</div>
					<div className={`${scrollTop.current > 0 ? 'visible' : 'invisible'} sidebar-bg-gradient-to-b bg-linear-to-b from-gray-50 dark:from-gray-950 to-transparent from-50% pointer-events-none absolute inset-0 -z-10 -mb-6`}></div>
				</div>

				<div className="px-1.5 pt-0.5 pb-1 flex flex-col gap-0 text-gray-600 dark:text-gray-400">
					<Link
						id="sidebar-new-chat-button"
						className={`group flex items-center justify-center rounded-xl ${showSidebar ? 'w-full' : 'size-9'} hover:bg-gray-100 dark:hover:bg-gray-850 transition outline-none`}
						to="/"
						draggable="false"
						onClick={newChatHandler}
						aria-label={t('New Chat')}
					>
						<div className="flex items-center justify-center size-9 shrink-0">
							<Icon name="PencilSquare" />
						</div>
						{showSidebar && (
							<div className="flex flex-1 items-center">
								<div className="text-[15px] font-primary text-gray-800 dark:text-gray-200">{t('New Chat')}</div>
								<div className="flex-1"></div>
							</div>
						)}
					</Link>

					<button
						id="sidebar-search-button"
						className={`group flex items-center justify-center rounded-xl ${showSidebar ? 'w-full' : 'size-9'} hover:bg-gray-100 dark:hover:bg-gray-850 transition outline-none text-left`}
						onClick={() => setShowSearch(true)}
						draggable={false}
						aria-label={t('Search')}
					>
						<div className="flex items-center justify-center size-9 shrink-0">
							<Icon name="Search" />
						</div>
						{showSidebar && (
							<div className="flex flex-1 items-center">
								<div className="text-[15px] font-primary text-gray-800 dark:text-gray-200">{t('Search')}</div>
								<div className="flex-1"></div>
							</div>
						)}
					</button>
				</div>

				<div
					className="relative flex flex-col flex-1 overflow-y-auto scrollbar-hidden pb-3"
					onScroll={(e) => {
						scrollTop.current = (e.target as HTMLElement).scrollTop;
					}}
				>
					{showSidebar && (
						<div id="sidebar-chats" className="px-2 mt-0.5">
							{pinnedChats.length > 0 && (
								<div className="mb-1">
									<div className="flex flex-col space-y-1 rounded-xl">
										<div className="ml-3 pl-1 mt-[1px] flex flex-col overflow-y-auto scrollbar-hidden border-s border-gray-100 dark:border-gray-900 text-gray-900 dark:text-gray-200">
											{pinnedChats.map((chat: any, idx: number) => (
												<ChatItem key={`pinned-chat-${idx}-${chat?.id ?? 'unknown'}`} chat={chat} onClick={itemClickHandler} />
											))}
										</div>
									</div>
								</div>
							)}
							<div className="flex-1 flex flex-col overflow-y-auto scrollbar-hidden">
								<div className="pt-1.5">
									{chats && chats.map((chat: any, idx: number) => (
										<React.Fragment key={`chat-${idx}-${chat?.id ?? 'unknown'}`}>
											{(idx === 0 || (idx > 0 && chat.time_range !== chats[idx - 1].time_range)) && (
												<div className={`w-full pl-2.5 text-xs text-gray-500 dark:text-gray-500 font-medium ${idx === 0 ? '' : 'pt-5'} pb-1.5`}>
													{t(chat.time_range)}
												</div>
											)}
											<ChatItem chat={chat} onClick={itemClickHandler} />
										</React.Fragment>
									))}
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="px-1.5 pt-1.5 pb-2 sticky bottom-0 z-10 sidebar">
					{showSidebar && (
						<div className="sidebar-bg-gradient-to-t bg-linear-to-t from-gray-50 dark:from-gray-950 to-transparent from-50% pointer-events-none absolute inset-0 -z-10 -mt-6"></div>
					)}
					<div className="flex flex-col font-primary">
						{user && (
							<div className={`flex items-center rounded-2xl py-2 px-1 hover:bg-gray-100/50 dark:hover:bg-gray-900/50 transition ${showSidebar ? 'w-full' : ''}`}>
								<div className="self-center shrink-0">
									<Avatar name={user.name} size="md" />
								</div>
								{showSidebar && (
									<div className="self-center font-medium ml-3">{user.name}</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function ChatItem({ chat, onClick }: { chat: any; onClick: () => void }) {
	const navigate = useNavigate();
	return (
		<Link
			to={`/c/${chat.id}`}
			className="block px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition text-sm truncate"
			onClick={onClick}
		>
			{chat.title || 'Untitled'}
		</Link>
	);
}
