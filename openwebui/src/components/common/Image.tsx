import React, { useState } from 'react';
import { WEBUI_BASE_URL } from '$lib/constants';
import { useStore } from '$lib/stores';
import { t } from '$lib/i18n';
import Icon from '../icons/Icon';
import ImagePreview from './ImagePreview';

interface ImageProps {
	src?: string;
	alt?: string;
	className?: string;
	imageClassName?: string;
	dismissible?: boolean;
	onDismiss?: () => void;
}

export default function Image({
	src = '',
	alt = '',
	className,
	imageClassName = 'rounded-lg',
	dismissible = false,
	onDismiss = () => {}
}: ImageProps) {
	const { settings } = useStore();
	const [showImagePreview, setShowImagePreview] = useState(false);

	const defaultClassName = `w-full ${(settings?.highContrastMode ?? false) ? '' : 'outline-hidden focus:outline-hidden'}`;
	const finalClassName = className ?? defaultClassName;

	const _src = src.startsWith('/') ? `${WEBUI_BASE_URL}${src}` : src;

	return (
		<>
			<ImagePreview show={showImagePreview} onClose={() => setShowImagePreview(false)} src={_src} alt={alt} />

			<div className="relative group w-fit flex items-center">
				<button
					className={finalClassName}
					onClick={() => setShowImagePreview(true)}
					aria-label={t('Show image preview')}
					type="button"
				>
					<img src={_src} alt={alt} className={imageClassName} draggable={false} data-cy="image" />
				</button>

				{dismissible && (
					<div className="absolute -top-1 -right-1">
						<button
							aria-label={t('Remove image')}
							className="bg-white text-black border border-white rounded-full group-hover:visible invisible transition"
							type="button"
							onClick={() => onDismiss()}
						>
							<Icon name="XMark" className="size-4" />
						</button>
					</div>
				)}
			</div>
		</>
	);
}
