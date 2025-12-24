import React, { useState } from 'react';
import { toast } from 'sonner';
import { t } from '$lib/i18n';
import { copyToClipboard } from '$lib/utils';
import Icon from '../../icons/Icon';
import CodeEditor from '../../common/CodeEditor';

interface CodeBlockProps {
	id?: string;
	edit?: boolean;
	onSave?: (e: any) => void;
	onUpdate?: (e: any) => void;
	onPreview?: (e: any) => void;
	save?: boolean;
	run?: boolean;
	preview?: boolean;
	collapsed?: boolean;
	token?: any;
	lang?: string;
	code?: string;
	attributes?: any;
	className?: string;
	editorClassName?: string;
	stickyButtonsClassName?: string;
}

export default function CodeBlock({
	id = '',
	edit = true,
	onSave = () => {},
	onUpdate = () => {},
	onPreview = () => {},
	save = false,
	run = true,
	preview = false,
	collapsed: initialCollapsed = false,
	token,
	lang = '',
	code = '',
	attributes = {},
	className = 'mb-2',
	editorClassName = '',
	stickyButtonsClassName = 'top-0'
}: CodeBlockProps) {
	const [internalCode, setInternalCode] = useState(code);
	const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
	const [copied, setCopied] = useState(false);
	const [executing, setExecuting] = useState(false);

	const handleCopy = async () => {
		const res = await copyToClipboard(internalCode);
		if (res) {
			setCopied(true);
			toast.success(t('Copied to clipboard'));
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleSave = () => {
		onSave({ code: internalCode });
	};

	return (
		<div className={`relative ${className}`}>
			<div className={`flex items-center justify-between px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-t-lg ${stickyButtonsClassName}`}>
				<span className="text-xs font-mono text-gray-500 dark:text-gray-400">
					{lang}
				</span>
				<div className="flex items-center gap-2">
					<button
						className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
						onClick={handleCopy}
						title={t('Copy')}
					>
						{copied ? (
							<Icon name="Check" className="size-4 text-green-500" />
						) : (
							<Icon name="Clipboard" className="size-4" />
						)}
					</button>
					{save && (
						<button
							className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
							onClick={handleSave}
							title={t('Save')}
						>
							<Icon name="ArrowUpTray" className="size-4" />
						</button>
					)}
				</div>
			</div>

			{!isCollapsed && (
				<div className={`bg-gray-50 dark:bg-gray-900 rounded-b-lg overflow-hidden ${editorClassName}`}>
					{edit ? (
						<CodeEditor
							value={internalCode}
							onChange={(value) => {
								setInternalCode(value);
								onUpdate({ code: value });
							}}
							onSave={handleSave}
						/>
					) : (
						<pre className="p-4 overflow-x-auto">
							<code className={`language-${lang}`}>{internalCode}</code>
						</pre>
					)}
				</div>
			)}
		</div>
	);
}
