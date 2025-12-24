import React, { useState, useRef, useEffect } from 'react';
import { t } from '$lib/i18n';
import Icon from '../icons/Icon';

interface SelectorProps {
	value?: string;
	placeholder?: string;
	searchEnabled?: boolean;
	searchPlaceholder?: string;
	items?: Array<{ value: string; label: string }>;
	onChange?: (value: string) => void;
}

export default function Selector({
	value = '',
	placeholder,
	searchEnabled = true,
	searchPlaceholder,
	items = [],
	onChange
}: SelectorProps) {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	const filteredItems = searchValue
		? items.filter((item) => item.value.toLowerCase().includes(searchValue.toLowerCase()))
		: items;

	const selectedItem = items.find((item) => item.value === value);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (itemValue: string) => {
		onChange?.(itemValue);
		setOpen(false);
		setSearchValue('');
	};

	return (
		<div ref={containerRef} className="relative w-full">
			<button
				className="relative w-full"
				aria-label={placeholder || t('Select a model')}
				onClick={() => {
					setOpen(!open);
					setSearchValue('');
				}}
			>
				<div className="inline-flex h-input px-0.5 w-full outline-hidden bg-transparent truncate text-lg font-semibold placeholder-gray-400 focus:outline-hidden">
					{selectedItem?.label || placeholder || t('Select a model')}
				</div>
				<Icon name="ChevronDown" className="absolute end-2 top-1/2 -translate-y-[45%] size-3.5" strokeWidth="2.5" />
			</button>

			{open && (
				<div className="absolute top-full left-0 w-full mt-1 rounded-lg bg-white dark:bg-gray-900 dark:text-white shadow-lg border border-gray-300/30 dark:border-gray-700/40 outline-hidden z-50">
					{searchEnabled && (
						<>
							<div className="flex items-center gap-2.5 px-5 mt-3.5 mb-3">
								<Icon name="Search" className="size-4" strokeWidth="2.5" />
								<input
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
									className="w-full text-sm bg-transparent outline-hidden"
									placeholder={searchPlaceholder || t('Search a model')}
								/>
							</div>
							<hr className="border-gray-100 dark:border-gray-850" />
						</>
					)}

					<div className="px-3 my-2 max-h-80 overflow-y-auto">
						{filteredItems.length > 0 ? (
							filteredItems.map((item) => (
								<button
									key={item.value}
									className="flex w-full font-medium line-clamp-1 select-none items-center rounded-button py-2 pl-3 pr-1.5 text-sm text-gray-700 dark:text-gray-100 outline-hidden transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-lg cursor-pointer"
									onClick={() => handleSelect(item.value)}
								>
									{item.label}
									{value === item.value && (
										<div className="ml-auto">
											<Icon name="Check" />
										</div>
									)}
								</button>
							))
						) : (
							<div className="block px-5 py-2 text-sm text-gray-700 dark:text-gray-100">
								{t('No results found')}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
