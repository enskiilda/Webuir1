import React, { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';

interface CodeEditorProps {
	value?: string;
	id?: string;
	onChange?: (value: string) => void;
	onSave?: () => void;
}

export default function CodeEditor({
	value = '',
	id = '',
	onChange,
	onSave
}: CodeEditorProps) {
	const [internalValue, setInternalValue] = useState(value);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		setInternalValue(newValue);
		onChange?.(newValue);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			onSave?.();
		}
		if (e.key === 'Tab') {
			e.preventDefault();
			const textarea = e.currentTarget;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const newValue = internalValue.substring(0, start) + '\t' + internalValue.substring(end);
			setInternalValue(newValue);
			onChange?.(newValue);
			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 1;
			}, 0);
		}
	};

	return (
		<textarea
			ref={textareaRef}
			id={id}
			className="w-full h-full min-h-[100px] p-4 px-5 font-mono text-sm bg-white dark:bg-black text-gray-900 dark:text-white border-none outline-none resize-none"
			value={internalValue}
			onChange={handleInput}
			onKeyDown={handleKeyDown}
			spellCheck={false}
		/>
	);
}
