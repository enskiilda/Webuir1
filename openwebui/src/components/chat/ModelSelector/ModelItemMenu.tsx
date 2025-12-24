import React, { ReactNode } from 'react';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import Icon from '../../icons/Icon';
import Dropdown from '../../common/Dropdown';

interface ModelItemMenuProps {
	show?: boolean;
	onOpenChange?: (open: boolean) => void;
	model?: any;
	onCopyLink?: () => void;
	children?: ReactNode;
}

export default function ModelItemMenu({
	show = false,
	onOpenChange,
	model,
	onCopyLink,
	children
}: ModelItemMenuProps) {
	const { user } = useStore();

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
				{onCopyLink && (
					<button
						className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => {
							onCopyLink();
							onOpenChange?.(false);
						}}
					>
						<Icon name="Link" className="size-4" />
						{t('Copy Link')}
					</button>
				)}
			</div>
		</Dropdown>
	);
}
