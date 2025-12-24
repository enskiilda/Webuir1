import React, { useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Icon from '../icons/Icon';
import Spinner from './Spinner';

interface CollapsibleProps {
	id?: string;
	className?: string;
	buttonClassName?: string;
	title?: string | null;
	attributes?: any;
	chevron?: boolean;
	grow?: boolean;
	disabled?: boolean;
	hide?: boolean;
	open?: boolean;
	onChange?: (open: boolean) => void;
	children?: ReactNode;
	content?: ReactNode;
}

export default function Collapsible({
	id = '',
	className = '',
	buttonClassName = 'w-fit text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition',
	title = null,
	attributes = null,
	chevron = false,
	grow = false,
	disabled = false,
	hide = false,
	open: initialOpen = false,
	onChange,
	children,
	content
}: CollapsibleProps) {
	const [open, setOpen] = useState(initialOpen);
	const collapsibleId = uuidv4();

	const handleToggle = () => {
		if (!disabled) {
			const newOpen = !open;
			setOpen(newOpen);
			onChange?.(newOpen);
		}
	};

	return (
		<div id={id} className={className}>
			{title !== null ? (
				<div className={`${buttonClassName} cursor-pointer`} onClick={handleToggle}>
					<div className={`w-full font-medium flex items-center justify-between gap-2 ${attributes?.done && attributes?.done !== 'true' ? 'shimmer' : ''}`}>
						{attributes?.done && attributes?.done !== 'true' && (
							<div>
								<Spinner className="size-4" />
							</div>
						)}
						<div>{title}</div>
						<div className="flex self-center translate-y-[1px]">
							{open ? (
								<Icon name="ChevronUp" strokeWidth="3.5" className="size-3.5" />
							) : (
								<Icon name="ChevronDown" strokeWidth="3.5" className="size-3.5" />
							)}
						</div>
					</div>
				</div>
			) : (
				<div className={`${buttonClassName} cursor-pointer`} onClick={handleToggle}>
					<div>
						<div className="flex items-start justify-between">
							{children}
							{chevron && (
								<div className="flex self-start translate-y-1">
									{open ? (
										<Icon name="ChevronUp" strokeWidth="3.5" className="size-3.5" />
									) : (
										<Icon name="ChevronDown" strokeWidth="3.5" className="size-3.5" />
									)}
								</div>
							)}
						</div>
						{grow && open && !hide && (
							<div onClick={(e) => e.stopPropagation()}>
								{content}
							</div>
						)}
					</div>
				</div>
			)}
			{!grow && open && !hide && (
				<div>{content}</div>
			)}
		</div>
	);
}
