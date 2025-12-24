import React, { ReactNode } from 'react';
import Icon from '../../../icons/Icon';
import Dropdown from '../../../common/Dropdown';

interface RegenerateMenuProps {
	show?: boolean;
	onOpenChange?: (open: boolean) => void;
	onRegenerate?: () => void;
	onContinue?: () => void;
	children?: ReactNode;
}

export default function RegenerateMenu({
	show = false,
	onOpenChange,
	onRegenerate,
	onContinue,
	children
}: RegenerateMenuProps) {
	return (
		<Dropdown
			show={show}
			onOpenChange={onOpenChange}
			side="bottom"
			align="start"
			className="w-40"
			trigger={children}
		>
			<div className="py-1">
				{onRegenerate && (
					<button
						className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => {
							onRegenerate();
							onOpenChange?.(false);
						}}
					>
						Regenerate
					</button>
				)}
				{onContinue && (
					<button
						className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => {
							onContinue();
							onOpenChange?.(false);
						}}
					>
						Continue
					</button>
				)}
			</div>
		</Dropdown>
	);
}
