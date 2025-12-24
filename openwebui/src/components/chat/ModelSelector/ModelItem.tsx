import React from 'react';
import { toast } from 'sonner';
import { t } from '$lib/i18n';
import { copyToClipboard } from '$lib/utils';
import Icon from '../../icons/Icon';
import ModelItemMenu from './ModelItemMenu';

interface ModelItemProps {
	item: any;
	index?: number;
	selectedModelIdx?: number;
	value?: string;
	onClick?: () => void;
}

export default function ModelItem({
	item,
	index = -1,
	selectedModelIdx = -1,
	value = '',
	onClick = () => {}
}: ModelItemProps) {
	const copyLinkHandler = async (model: any) => {
		const baseUrl = window.location.origin;
		const res = await copyToClipboard(`${baseUrl}/?model=${encodeURIComponent(model.id)}`);

		if (res) {
			toast.success(t('Copied link to clipboard'));
		} else {
			toast.error(t('Failed to copy link'));
		}
	};

	return (
		<button
			aria-roledescription="model-item"
			aria-label={item.label}
			className={`flex group/item w-full text-left font-medium line-clamp-1 select-none items-center rounded-button py-2 pl-3 pr-1.5 text-sm text-gray-700 dark:text-gray-100 outline-hidden transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer ${
				index === selectedModelIdx ? 'bg-gray-100 dark:bg-gray-800 group-hover:bg-transparent' : ''
			}`}
			data-arrow-selected={index === selectedModelIdx}
			data-value={item.value}
			onClick={onClick}
		>
			<div className="flex flex-col flex-1 gap-1.5">
				<div className="flex items-center gap-2.5">
					<div className="flex flex-col min-w-0">
						<span className="line-clamp-1 text-gray-700 dark:text-gray-100 font-medium">
							{item.label}
						</span>
						{item.model?.info?.meta?.description && (
							<span className="text-xs text-gray-500 line-clamp-1">
								{item.model.info.meta.description}
							</span>
						)}
					</div>
				</div>
			</div>

			{value === item.value && (
				<div className="ml-auto">
					<Icon name="Check" className="size-4" />
				</div>
			)}
		</button>
	);
}
