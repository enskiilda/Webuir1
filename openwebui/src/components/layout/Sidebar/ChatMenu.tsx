import React, { useState, ReactNode } from 'react';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import Icon from '../../icons/Icon';
import Dropdown from '../../common/Dropdown';

interface ChatMenuProps {
	show?: boolean;
	onOpenChange?: (open: boolean) => void;
	onEdit?: () => void;
	onDelete?: () => void;
	onClone?: () => void;
	onShare?: () => void;
	onArchive?: () => void;
	children?: ReactNode;
}

export default function ChatMenu({
	show = false,
	onOpenChange,
	onEdit,
	onDelete,
	onClone,
	onShare,
	onArchive,
	children
}: ChatMenuProps) {
	return (
		<Dropdown
			show={show}
			onOpenChange={onOpenChange}
			side="bottom"
			align="end"
			className="w-44"
			trigger={children}
		>
			<div className="py-1">
				{onEdit && (
					<button
						className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => {
							onEdit();
							onOpenChange?.(false);
						}}
					>
						<Icon name="PencilSquare" className="size-4" />
						{t('Rename')}
					</button>
				)}

				{onClone && (
					<button
						className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => {
							onClone();
							onOpenChange?.(false);
						}}
					>
						<Icon name="DocumentDuplicate" className="size-4" />
						{t('Clone')}
					</button>
				)}

				{onShare && (
					<button
						className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => {
							onShare();
							onOpenChange?.(false);
						}}
					>
						<Icon name="Share" className="size-4" />
						{t('Share')}
					</button>
				)}

				{onArchive && (
					<button
						className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => {
							onArchive();
							onOpenChange?.(false);
						}}
					>
						<Icon name="ArchiveBox" className="size-4" />
						{t('Archive')}
					</button>
				)}

				{onDelete && (
					<>
						<hr className="my-1 border-gray-100 dark:border-gray-700" />
						<button
							className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
							onClick={() => {
								onDelete();
								onOpenChange?.(false);
							}}
						>
							<Icon name="GarbageBin" className="size-4" />
							{t('Delete')}
						</button>
					</>
				)}
			</div>
		</Dropdown>
	);
}
