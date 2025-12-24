import React from 'react';
import { WEBUI_BASE_URL } from '$lib/constants';

interface ProfileImageProps {
	className?: string;
	src?: string;
}

export default function ProfileImage({
	className = 'size-8',
	src = `${WEBUI_BASE_URL}/static/favicon.png`
}: ProfileImageProps) {
	const getSrc = () => {
		if (src === '') return `${WEBUI_BASE_URL}/static/favicon.png`;
		if (
			src.startsWith(WEBUI_BASE_URL) ||
			src.startsWith('https://www.gravatar.com/avatar/') ||
			src.startsWith('data:') ||
			src.startsWith('/')
		) {
			return src;
		}
		return `${WEBUI_BASE_URL}/user.png`;
	};

	return (
		<img
			aria-hidden="true"
			src={getSrc()}
			className={`${className} object-cover rounded-full`}
			alt="profile"
			draggable={false}
		/>
	);
}
