import React, { ReactNode } from 'react';
import { t } from '$lib/i18n';

interface AddFilesPlaceholderProps {
	title?: string;
	content?: string;
	children?: ReactNode;
}

export default function AddFilesPlaceholder({ title = '', content = '', children }: AddFilesPlaceholderProps) {
	return (
		<div className="px-3">
			<div className="text-center dark:text-white text-2xl font-medium z-50">
				{title || t('Add Files')}
			</div>

			{children || (
				<div className="px-2 mt-2 text-center text-gray-700 dark:text-gray-200 w-full">
					{content || t('Drop any files here to upload')}
				</div>
			)}
		</div>
	);
}
