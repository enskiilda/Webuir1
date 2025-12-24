import React, { useState, useEffect } from 'react';
import { t } from '$lib/i18n';
import { marked } from 'marked';

interface ConfirmDialogProps {
	show: boolean;
	onClose: () => void;
	onConfirm: (inputValue?: string) => void;
	title?: string;
	message?: string;
	cancelLabel?: string;
	confirmLabel?: string;
	input?: boolean;
	inputPlaceholder?: string;
	children?: React.ReactNode;
}

export default function ConfirmDialog({
	show,
	onClose,
	onConfirm,
	title = '',
	message = '',
	cancelLabel,
	confirmLabel,
	input = false,
	inputPlaceholder = '',
	children
}: ConfirmDialogProps) {
	const [inputValue, setInputValue] = useState('');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (show) {
			setInputValue('');
		}
	}, [show]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
			if (event.key === 'Enter') {
				handleConfirm();
			}
		};

		if (show) {
			window.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'unset';
		};
	}, [show, onClose]);

	const handleConfirm = () => {
		onClose();
		onConfirm(inputValue);
	};

	if (!show || !mounted) return null;

	return (
		<div
			className="fixed top-0 right-0 left-0 bottom-0 bg-black/60 w-full h-screen max-h-[100dvh] flex justify-center z-[99999999] overflow-hidden overscroll-contain"
			onMouseDown={() => onClose()}
		>
			<div
				className="m-auto max-w-full w-[32rem] mx-2 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm rounded-4xl max-h-[100dvh] shadow-3xl border border-white dark:border-gray-900"
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="px-[1.75rem] py-6 flex flex-col">
					<div className="text-lg font-medium dark:text-gray-200 mb-2.5">
						{title !== '' ? title : t('Confirm your action')}
					</div>

					{children || (
						<div className="text-sm text-gray-500 flex-1">
							{message !== '' ? (
								<div dangerouslySetInnerHTML={{ __html: marked.parse(message) as string }} />
							) : (
								t('This action cannot be undone. Do you wish to continue?')
							)}

							{input && (
								<textarea
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									placeholder={inputPlaceholder || t('Enter your message')}
									className="w-full mt-2 rounded-lg px-4 py-2 text-sm dark:text-gray-300 dark:bg-gray-900 outline-hidden resize-none"
									rows={3}
									required
								/>
							)}
						</div>
					)}

					<div className="mt-6 flex justify-between gap-1.5">
						<button
							className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-850 dark:hover:bg-gray-800 dark:text-white font-medium w-full py-2 rounded-3xl transition"
							onClick={() => onClose()}
							type="button"
						>
							{cancelLabel || t('Cancel')}
						</button>
						<button
							className="text-sm bg-gray-900 hover:bg-gray-850 text-gray-100 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-800 font-medium w-full py-2 rounded-3xl transition"
							onClick={handleConfirm}
							type="button"
						>
							{confirmLabel || t('Confirm')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
