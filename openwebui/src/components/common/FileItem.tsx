import React, { useState } from 'react';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import { formatFileSize } from '$lib/utils';
import Icon from '../icons/Icon';
import Spinner from './Spinner';
import FileItemModal from './FileItemModal';

interface FileItemProps {
	className?: string;
	colorClassName?: string;
	url?: string | null;
	dismissible?: boolean;
	modal?: boolean;
	loading?: boolean;
	item?: any;
	edit?: boolean;
	small?: boolean;
	name: string;
	type: string;
	size?: number;
	onDismiss?: () => void;
	onClick?: () => void;
}

const decodeString = (str: string) => {
	try {
		return decodeURIComponent(str);
	} catch (e) {
		return str;
	}
};

export default function FileItem({
	className = 'w-60',
	colorClassName = 'bg-white dark:bg-gray-850 border border-gray-50 dark:border-gray-800',
	url = null,
	dismissible = false,
	modal = false,
	loading = false,
	item = null,
	edit = false,
	small = false,
	name,
	type,
	size,
	onDismiss,
	onClick
}: FileItemProps) {
	const { settings } = useStore();
	const [showModal, setShowModal] = useState(false);

	const handleClick = () => {
		if (item?.file?.data?.content || item?.type === 'file' || modal) {
			setShowModal(!showModal);
		} else {
			if (url) {
				if (type === 'file') {
					window.open(`${url}/content`, '_blank')?.focus();
				} else {
					window.open(`${url}`, '_blank')?.focus();
				}
			}
		}
		onClick?.();
	};

	return (
		<>
			{item && (
				<FileItemModal show={showModal} onClose={() => setShowModal(false)} item={item} edit={edit} />
			)}

			<button
				className={`relative group p-1.5 ${className} flex items-center gap-1 ${colorClassName} ${small ? 'rounded-xl p-2' : 'rounded-2xl'} text-left`}
				type="button"
				onClick={handleClick}
			>
				{!small ? (
					<div className="size-10 shrink-0 flex justify-center items-center bg-black/20 dark:bg-white/10 text-white rounded-xl">
						{!loading ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
								className="size-4.5"
							>
								<path
									fillRule="evenodd"
									d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
									clipRule="evenodd"
								/>
								<path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
							</svg>
						) : (
							<Spinner />
						)}
					</div>
				) : (
					<div className="pl-1.5">
						{!loading ? (
							<Icon name="Document" />
						) : (
							<Spinner />
						)}
					</div>
				)}

				{!small ? (
					<div className="flex flex-col justify-center -space-y-0.5 px-2.5 w-full">
						<div className="dark:text-gray-100 text-sm font-medium line-clamp-1 mb-1">
							{decodeString(name)}
						</div>
						<div className={`flex justify-between text-xs line-clamp-1 ${(settings?.highContrastMode ?? false) ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500'}`}>
							{type === 'file' ? t('File') : type === 'note' ? t('Note') : type === 'doc' ? t('Document') : type === 'collection' ? t('Collection') : <span className="capitalize line-clamp-1">{type}</span>}
							{size && <span className="capitalize">{formatFileSize(size)}</span>}
						</div>
					</div>
				) : (
					<div className="flex flex-col justify-center -space-y-0.5 px-1 w-full">
						<div className="dark:text-gray-100 text-sm flex justify-between items-center">
							<div className="font-medium line-clamp-1 flex-1 pr-1">{decodeString(name)}</div>
							{size ? (
								<div className="text-gray-500 text-xs capitalize shrink-0">{formatFileSize(size)}</div>
							) : (
								<div className="text-gray-500 text-xs capitalize shrink-0">{type}</div>
							)}
						</div>
					</div>
				)}

				{dismissible && (
					<div className="absolute -top-1 -right-1">
						<button
							aria-label={t('Remove File')}
							className={`bg-white text-black border border-gray-50 rounded-full ${(settings?.highContrastMode ?? false) ? '' : 'outline-hidden focus:outline-hidden group-hover:visible invisible transition'}`}
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onDismiss?.();
							}}
						>
							<Icon name="XMark" className="size-4" />
						</button>
					</div>
				)}
			</button>
		</>
	);
}
