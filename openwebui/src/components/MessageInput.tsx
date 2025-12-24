import React, { useRef, useEffect, KeyboardEvent, useState } from 'react';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import Icon from './Icon';

interface MessageInputProps {
	prompt: string;
	setPrompt: (v: string) => void;
	files: any[];
	setFiles: (v: any[]) => void;
	generating: boolean;
	stopResponse: () => void;
	submitPrompt: (prompt: string) => void;
	placeholder?: string;
}

export default function MessageInput({
	prompt, setPrompt, files, setFiles, generating, stopResponse, submitPrompt, placeholder
}: MessageInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const filesInputRef = useRef<HTMLInputElement>(null);
	const { settings } = useStore();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(true);
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, []);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 208) + 'px';
		}
	}, [prompt]);

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (generating) {
			stopResponse();
		} else if (prompt.trim() || files.length > 0) {
			submitPrompt(prompt);
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		const isCtrlPressed = e.ctrlKey || e.metaKey;
		
		if (e.key === 'Escape') {
			stopResponse();
		}

		const enterPressed = (settings?.ctrlEnterToSend ?? false)
			? (e.key === 'Enter' || e.keyCode === 13) && isCtrlPressed
			: (e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey;

		if (enterPressed) {
			e.preventDefault();
			if (prompt !== '' || files.length > 0) {
				handleSubmit();
			}
		}
	};

	const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputFiles = e.target.files;
		if (inputFiles && inputFiles.length > 0) {
			const fileList = Array.from(inputFiles);
			fileList.forEach(file => {
				if (file.type.startsWith('image/')) {
					const reader = new FileReader();
					reader.onload = (event) => {
						setFiles([...files, { type: 'image', url: event.target?.result as string }]);
					};
					reader.readAsDataURL(file);
				}
			});
		}
		if (filesInputRef.current) {
			filesInputRef.current.value = '';
		}
	};

	if (!loaded) return null;

	return (
		<div className="w-full font-primary">
			<div className="mx-auto inset-x-0 bg-transparent flex justify-center">
				<div className={`flex flex-col px-3 md:px-4 lg:px-5 ${(settings?.widescreenMode ?? null) ? 'max-w-full' : 'max-w-3xl xl:max-w-4xl 2xl:max-w-5xl'} w-full`}>
					<div className="relative"></div>
				</div>
			</div>

			<div className="bg-transparent">
				<div className={`${(settings?.widescreenMode ?? null) ? 'max-w-full' : 'max-w-3xl xl:max-w-4xl 2xl:max-w-5xl'} px-2.5 md:px-3 lg:px-4 mx-auto inset-x-0`}>
					<div>
						<input
							ref={filesInputRef}
							type="file"
							hidden
							multiple
							accept="image/*"
							onChange={handleFilesChange}
						/>

						<form className="w-full flex flex-col gap-1.5" onSubmit={handleSubmit}>
							<div
								id="message-input-container"
								className="w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto bg-white dark:bg-[#212121] cursor-text overflow-clip bg-clip-padding p-2.5 shadow-lg border border-gray-200 dark:border-transparent transition-all duration-200 rounded-[28px] grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto]"
								style={{ gridTemplateAreas: "'header header header' 'leading primary trailing' '. footer .'" }}
								dir={settings?.chatDirection ?? 'auto'}
							>
								{/* Files preview */}
								{files.length > 0 && (
									<div className="mx-2 mt-2.5 pb-1.5 flex items-center flex-wrap gap-2" style={{ gridArea: 'header' }}>
										{files.map((file, fileIdx) => (
											<div key={fileIdx} className="relative group">
												{file.type === 'image' ? (
													<div className="relative flex items-center">
														<img
															src={file.url}
															alt=""
															className="size-10 rounded-xl object-cover"
														/>
														<div className="absolute -top-1 -right-1">
															<button
																className="bg-white text-black border border-white rounded-full outline-hidden focus:outline-hidden group-hover:visible invisible transition"
																type="button"
																aria-label={t('Remove file')}
																onClick={() => {
																	const newFiles = [...files];
																	newFiles.splice(fileIdx, 1);
																	setFiles(newFiles);
																}}
															>
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
																	<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
																</svg>
															</button>
														</div>
													</div>
												) : (
													<div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-xs">
														<span className="truncate max-w-[100px]">{file.name}</span>
														<button onClick={() => {
															const newFiles = [...files];
															newFiles.splice(fileIdx, 1);
															setFiles(newFiles);
														}} className="text-gray-400 hover:text-gray-600">
															<Icon name="X" className="size-3" />
														</button>
													</div>
												)}
											</div>
										))}
									</div>
								)}

								{/* Leading section with + button */}
								<div className="flex" style={{ gridArea: 'leading' }}>
									<button
										type="button"
										className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 h-9 w-9 rounded-full"
										onClick={() => filesInputRef.current?.click()}
									>
										<Icon name="Plus" className="size-6 text-muted-foreground" />
									</button>
								</div>

								{/* Primary input area */}
								<div
									className="flex min-h-14 items-center overflow-x-hidden px-1.5 -my-2.5 text-left"
									style={{ gridArea: 'primary' }}
								>
									<div className="flex-1 overflow-auto max-h-52">
										<textarea
											ref={textareaRef}
											id="chat-input"
											className="w-full bg-transparent border-none outline-none resize-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-[40px] max-h-[208px] py-2"
											placeholder={placeholder || t('Send a Message')}
											value={prompt}
											onChange={(e) => setPrompt(e.target.value)}
											onKeyDown={handleKeyDown}
											rows={1}
										/>
									</div>
								</div>

								{/* Trailing section with send/stop button */}
								<div className="flex items-center" style={{ gridArea: 'trailing' }}>
									<div className="flex items-center">
										<button
											id="send-message-button"
											className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${generating ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'} size-9 h-9 w-9 rounded-full`}
											type={generating ? 'button' : 'submit'}
											disabled={!generating && (prompt === '' && files.length === 0)}
											onClick={() => {
												if (generating) {
													stopResponse();
												}
											}}
										>
											{generating ? (
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
													<rect x="6" y="6" width="12" height="12" rx="1" />
												</svg>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
													<path d="M12 19V5" />
													<path d="M5 12l7-7 7 7" />
												</svg>
											)}
										</button>
									</div>
								</div>
							</div>

							<div className="mb-1"></div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
