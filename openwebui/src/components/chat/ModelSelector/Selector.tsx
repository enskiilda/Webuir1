import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import Icon from '../../icons/Icon';
import Spinner from '../../common/Spinner';
import ModelItem from './ModelItem';

interface SelectorProps {
	id?: string;
	value?: string;
	placeholder?: string;
	items?: any[];
	className?: string;
	onChange?: (value: string) => void;
}

export default function Selector({
	id = '',
	value = '',
	placeholder,
	items = [],
	className = 'min-w-fit',
	onChange
}: SelectorProps) {
	const { mobile } = useStore();
	const [show, setShow] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [selectedModelIdx, setSelectedModelIdx] = useState(0);

	const selectedModel = useMemo(() => items.find((item) => item.value === value), [items, value]);

	const fuse = useMemo(() => new Fuse(items.map((item) => ({
		...item,
		modelName: item.model?.name,
		tags: (item.model?.tags ?? []).map((tag: any) => tag.name).join(' '),
		desc: item.model?.info?.meta?.description
	})), {
		keys: ['value', 'tags', 'modelName'],
		threshold: 0.4
	}), [items]);

	const filteredItems = useMemo(() => {
		if (!searchValue.trim()) return items;
		return fuse.search(searchValue).map((result) => result.item);
	}, [searchValue, items, fuse]);

	const handleSelect = (item: any) => {
		onChange?.(item.value);
		setShow(false);
		setSearchValue('');
	};

	return (
		<div className={`relative ${className}`}>
			<button
				id={id}
				className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
				onClick={() => setShow(!show)}
			>
				<span className="truncate max-w-[200px]">
					{selectedModel?.label || placeholder || t('Select a model')}
				</span>
				<Icon name="ChevronDown" className="size-4" />
			</button>

			{show && (
				<div className="absolute top-full left-0 mt-1 w-80 max-h-96 overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 z-50">
					<div className="p-3 border-b border-gray-100 dark:border-gray-800">
						<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
							<Icon name="Search" className="size-4 text-gray-500" />
							<input
								type="text"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								placeholder={t('Search a model')}
								className="flex-1 bg-transparent outline-none text-sm"
								autoFocus
							/>
						</div>
					</div>

					<div className="p-2 max-h-72 overflow-y-auto">
						{filteredItems.length > 0 ? (
							filteredItems.map((item, idx) => (
								<ModelItem
									key={item.value}
									item={item}
									index={idx}
									selectedModelIdx={selectedModelIdx}
									value={value}
									onClick={() => handleSelect(item)}
								/>
							))
						) : (
							<div className="p-4 text-center text-sm text-gray-500">
								{t('No models found')}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
