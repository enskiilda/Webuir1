import React, { useEffect, useState } from 'react';
import { t } from '$lib/i18n';
import Icon from '../icons/Icon';

interface ImagePreviewProps {
	show: boolean;
	onClose: () => void;
	src?: string;
	alt?: string;
}

export default function ImagePreview({ show, onClose, src = '', alt = '' }: ImagePreviewProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
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

	const handleDownload = () => {
		if (src.startsWith('data:image/')) {
			const base64Data = src.split(',')[1];
			const blob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], {
				type: 'image/png'
			});
			const mimeType = blob.type || 'image/png';
			const fileName = `${t('Generated Image').toLowerCase().replace(/ /g, '_')}.${mimeType.split('/')[1]}`;
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = fileName;
			a.click();
			URL.revokeObjectURL(url);
		} else if (src.startsWith('blob:') || src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://')) {
			fetch(src)
				.then((response) => response.blob())
				.then((blob) => {
					const mimeType = blob.type || 'image/png';
					const blobWithType = new Blob([blob], { type: mimeType });
					const fileName = `${t('Generated Image').toLowerCase().replace(/ /g, '_')}.${mimeType.split('/')[1]}`;
					const url = URL.createObjectURL(blobWithType);
					const a = document.createElement('a');
					a.href = url;
					a.download = fileName;
					a.click();
					URL.revokeObjectURL(url);
				})
				.catch((error) => {
					console.error('Error downloading image:', error);
				});
		}
	};

	if (!show || !mounted) return null;

	return (
		<div className="modal fixed top-0 right-0 left-0 bottom-0 bg-black text-white w-full min-h-screen h-screen flex justify-center z-[9999] overflow-hidden overscroll-contain">
			<div className="absolute left-0 w-full flex justify-between select-none z-20">
				<div>
					<button
						className="p-5"
						onClick={() => onClose()}
					>
						<Icon name="XMark" className="size-6" />
					</button>
				</div>

				<div>
					<button
						className="p-5 z-[999]"
						aria-label="Download image"
						onClick={handleDownload}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-6 h-6"
						>
							<path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
							<path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
						</svg>
					</button>
				</div>
			</div>
			<div className="flex h-full max-h-full justify-center items-center z-0">
				<img
					src={src}
					alt={alt}
					className="mx-auto h-full object-scale-down select-none"
					draggable={false}
				/>
			</div>
		</div>
	);
}
