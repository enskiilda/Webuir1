import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import Icon from '../../icons/Icon';
import ChatMenu from './ChatMenu';
import ConfirmDialog from '../../common/ConfirmDialog';

interface ChatItemProps {
	className?: string;
	id: string;
	title: string;
	selected?: boolean;
	shiftKey?: boolean;
	onDragEnd?: () => void;
	onChange?: () => void;
}

export default function ChatItem({
	className = '',
	id,
	title,
	selected = false,
	shiftKey = false,
	onDragEnd = () => {},
	onChange = () => {}
}: ChatItemProps) {
	const navigate = useNavigate();
	const { chatId, setChatId, mobile, setShowSidebar } = useStore();

	const [mouseOver, setMouseOver] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [confirmEdit, setConfirmEdit] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [chatTitle, setChatTitle] = useState(title);

	const handleClick = () => {
		if (mobile) {
			setShowSidebar(false);
		}
		navigate(`/c/${id}`);
	};

	const handleDelete = () => {
		setConfirmDelete(false);
		toast.success(t('Chat deleted'));
		onChange();
	};

	const handleEdit = () => {
		if (chatTitle === '') {
			toast.error(t('Title cannot be an empty string.'));
		} else {
			setConfirmEdit(false);
			toast.success(t('Chat renamed'));
			onChange();
		}
	};

	return (
		<>
			<ConfirmDialog
				show={confirmDelete}
				onClose={() => setConfirmDelete(false)}
				onConfirm={handleDelete}
				title={t('Delete chat?')}
				message={t('This will delete the chat permanently.')}
			/>

			<div
				className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-850 ${selected ? 'bg-gray-100 dark:bg-gray-850' : ''} ${className}`}
				onClick={handleClick}
				onMouseEnter={() => setMouseOver(true)}
				onMouseLeave={() => setMouseOver(false)}
			>
				<div className="flex-1 min-w-0">
					<div className="text-sm font-medium truncate dark:text-gray-100">
						{confirmEdit ? (
							<input
								type="text"
								value={chatTitle}
								onChange={(e) => setChatTitle(e.target.value)}
								onBlur={() => handleEdit()}
								onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
								className="w-full bg-transparent outline-none"
								autoFocus
							/>
						) : (
							title
						)}
					</div>
				</div>

				<div className={`flex items-center gap-1 ${mouseOver ? 'opacity-100' : 'opacity-0'} transition`}>
					<ChatMenu
						show={showMenu}
						onOpenChange={setShowMenu}
						onEdit={() => setConfirmEdit(true)}
						onDelete={() => setConfirmDelete(true)}
					>
						<button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
							<Icon name="EllipsisHorizontal" className="size-4" />
						</button>
					</ChatMenu>
				</div>
			</div>
		</>
	);
}
