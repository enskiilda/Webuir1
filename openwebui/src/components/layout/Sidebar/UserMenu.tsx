import React, { ReactNode } from 'react';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import Icon from '../../icons/Icon';
import Dropdown from '../../common/Dropdown';

interface UserMenuProps {
	show?: boolean;
	onOpenChange?: (open: boolean) => void;
	onShow?: (view: string) => void;
	className?: string;
	children?: ReactNode;
}

export default function UserMenu({
	show = false,
	onOpenChange,
	onShow,
	className = 'max-w-[240px]',
	children
}: UserMenuProps) {
	const { user, setShowSettings, mobile, setShowSidebar } = useStore();

	const handleSettings = () => {
		setShowSettings(true);
		if (mobile) {
			setShowSidebar(false);
		}
		onOpenChange?.(false);
	};

	const handleArchivedChats = () => {
		onShow?.('archived-chat');
		if (mobile) {
			setShowSidebar(false);
		}
		onOpenChange?.(false);
	};

	return (
		<Dropdown
			show={show}
			onOpenChange={onOpenChange}
			side="top"
			align="end"
			className={`w-full ${className} rounded-2xl px-1 py-1 border border-gray-100 dark:border-gray-800 z-50 bg-white dark:bg-gray-850 dark:text-white shadow-lg text-sm`}
			trigger={children}
		>
			<div>
				<button
					className="flex rounded-xl py-1.5 px-3 w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
					onClick={handleSettings}
				>
					<div className="self-center mr-3">
						<Icon name="Settings" className="w-5 h-5" strokeWidth="1.5" />
					</div>
					<div className="self-center truncate">{t('Settings')}</div>
				</button>

				<button
					className="flex rounded-xl py-1.5 px-3 w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
					onClick={handleArchivedChats}
				>
					<div className="self-center mr-3">
						<Icon name="ArchiveBox" className="size-5" strokeWidth="1.5" />
					</div>
					<div className="self-center truncate">{t('Archived Chats')}</div>
				</button>
			</div>
		</Dropdown>
	);
}
