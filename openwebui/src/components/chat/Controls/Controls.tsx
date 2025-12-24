import React from 'react';
import { t } from '$lib/i18n';
import { useStore } from '$lib/stores';
import Icon from '../../icons/Icon';
import FileItem from '../../common/FileItem';
import Collapsible from '../../common/Collapsible';

interface ControlsProps {
	chatFiles?: any[];
	params?: any;
	models?: any[];
	onClose?: () => void;
	onChatFilesChange?: (files: any[]) => void;
	onParamsChange?: (params: any) => void;
}

export default function Controls({
	chatFiles = [],
	params = {},
	models = [],
	onClose,
	onChatFilesChange,
	onParamsChange
}: ControlsProps) {
	const { user, settings } = useStore();

	const handleFileRemove = (fileIdx: number) => {
		const newFiles = [...chatFiles];
		newFiles.splice(fileIdx, 1);
		onChatFilesChange?.(newFiles);
	};

	const handleSystemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onParamsChange?.({ ...params, system: e.target.value });
	};

	const canShowControls = user?.role === 'admin' || (user?.permissions?.chat?.controls ?? true);
	const canShowSystemPrompt = user?.role === 'admin' || (user?.permissions?.chat?.system_prompt ?? true);

	return (
		<div className="dark:text-white">
			<div className="flex items-center justify-between dark:text-gray-100 mb-2">
				<div className="text-lg font-medium self-center font-primary">{t('Chat Controls')}</div>
				<button className="self-center" onClick={onClose}>
					<Icon name="XMark" className="size-3.5" />
				</button>
			</div>

			{canShowControls && (
				<div className="dark:text-gray-200 text-sm font-primary py-0.5 px-0.5">
					{chatFiles.length > 0 && (
						<>
							<Collapsible title={t('Files')} open={true} buttonClassName="w-full">
								<div className="flex flex-col gap-1 mt-1.5">
									{chatFiles.map((file, fileIdx) => (
										<FileItem
											key={fileIdx}
											className="w-full"
											item={file}
											edit={true}
											url={file?.url || null}
											name={file.name}
											type={file.type}
											size={file?.size}
											dismissible={true}
											small={true}
											onDismiss={() => handleFileRemove(fileIdx)}
										/>
									))}
								</div>
							</Collapsible>
							<hr className="my-2 border-gray-50 dark:border-gray-700/10" />
						</>
					)}

					{canShowSystemPrompt && (
						<>
							<Collapsible title={t('System Prompt')} open={true} buttonClassName="w-full">
								<div>
									<textarea
										value={params.system || ''}
										onChange={handleSystemChange}
										className={`w-full text-xs outline-hidden resize-y ${
											settings?.highContrastMode
												? 'border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 p-2.5'
												: 'py-1.5 bg-transparent'
										}`}
										rows={4}
										placeholder={t('Enter system prompt')}
									/>
								</div>
							</Collapsible>
							<hr className="my-2 border-gray-50 dark:border-gray-700/10" />
						</>
					)}
				</div>
			)}
		</div>
	);
}
