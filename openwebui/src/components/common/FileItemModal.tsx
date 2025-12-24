import React from 'react';

interface FileItemModalProps {
	show: boolean;
	onClose: () => void;
	item: any;
	edit?: boolean;
}

export default function FileItemModal({ show, onClose, item, edit = false }: FileItemModalProps) {
	if (!show) return null;

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-900 rounded-xl p-4 max-w-2xl max-h-[80vh] overflow-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-medium">{item?.name || 'File'}</h3>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						×
					</button>
				</div>
				{item?.content && (
					<pre className="whitespace-pre-wrap text-sm">{item.content}</pre>
				)}
			</div>
		</div>
	);
}
