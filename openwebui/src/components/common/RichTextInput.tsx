import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { t } from '$lib/i18n';

interface RichTextInputProps {
	id?: string;
	value?: string;
	placeholder?: string;
	className?: string;
	onChange?: (e: { md: string; text: string }) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	onCompositionStart?: (e: React.CompositionEvent) => void;
	onCompositionEnd?: (e: React.CompositionEvent) => void;
}

export interface RichTextInputRef {
	focus: () => void;
	blur: () => void;
	setText: (text: string) => void;
	getText: () => string;
	getMarkdown: () => string;
	insertContent: (text: string) => void;
	replaceVariables: (variables: Record<string, string>) => void;
	getWordAtDocPos: () => string;
	replaceCommandWithText: (text: string) => void;
}

const RichTextInput = forwardRef<RichTextInputRef, RichTextInputProps>(({
	id = '',
	value = '',
	placeholder,
	className = 'input-prose',
	onChange,
	onKeyDown,
	onCompositionStart,
	onCompositionEnd
}, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [internalValue, setInternalValue] = React.useState(value);

	const adjustHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
		}
	};

	useEffect(() => {
		adjustHeight();
	}, [internalValue]);

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		setInternalValue(newValue);
		adjustHeight();
		onChange?.({ md: newValue, text: newValue });
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		onKeyDown?.(e);
	};

	useImperativeHandle(ref, () => ({
		focus: () => textareaRef.current?.focus(),
		blur: () => textareaRef.current?.blur(),
		setText: (text: string) => {
			setInternalValue(text);
			if (textareaRef.current) {
				textareaRef.current.value = text;
				adjustHeight();
			}
			onChange?.({ md: text, text: text });
		},
		getText: () => internalValue,
		getMarkdown: () => internalValue,
		insertContent: (text: string) => {
			if (!textareaRef.current) return;
			const start = textareaRef.current.selectionStart;
			const end = textareaRef.current.selectionEnd;
			const before = internalValue.substring(0, start);
			const after = internalValue.substring(end);
			const newValue = before + text + after;
			setInternalValue(newValue);
			textareaRef.current.value = newValue;
			setTimeout(() => {
				if (textareaRef.current) {
					textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + text.length;
					adjustHeight();
				}
			}, 0);
			onChange?.({ md: newValue, text: newValue });
		},
		replaceVariables: (variables: Record<string, string>) => {
			let newValue = internalValue;
			for (const [key, val] of Object.entries(variables)) {
				newValue = newValue.replace(new RegExp(`{{${key}}}`, 'g'), val);
			}
			setInternalValue(newValue);
			if (textareaRef.current) {
				textareaRef.current.value = newValue;
				adjustHeight();
			}
			onChange?.({ md: newValue, text: newValue });
		},
		getWordAtDocPos: () => {
			if (!textareaRef.current) return '';
			const pos = textareaRef.current.selectionStart;
			const text = internalValue;
			let start = pos;
			let end = pos;
			while (start > 0 && !/\s/.test(text[start - 1])) start--;
			while (end < text.length && !/\s/.test(text[end])) end++;
			return text.substring(start, end);
		},
		replaceCommandWithText: (text: string) => {
			if (!textareaRef.current) return;
			const pos = textareaRef.current.selectionStart;
			const currentText = internalValue;
			let start = pos;
			while (start > 0 && !/\s/.test(currentText[start - 1])) start--;
			const before = currentText.substring(0, start);
			const after = currentText.substring(pos);
			const newValue = before + text + after;
			setInternalValue(newValue);
			textareaRef.current.value = newValue;
			adjustHeight();
			onChange?.({ md: newValue, text: newValue });
		}
	}));

	return (
		<textarea
			ref={textareaRef}
			id={id}
			value={internalValue}
			placeholder={placeholder || t('Type here...')}
			className={`w-full bg-transparent border-none outline-none resize-none ${className}`}
			onChange={handleInput}
			onKeyDown={handleKeyDown}
			onCompositionStart={onCompositionStart}
			onCompositionEnd={onCompositionEnd}
			rows={1}
		/>
	);
});

RichTextInput.displayName = 'RichTextInput';

export default RichTextInput;
