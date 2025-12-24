import React from 'react';
import { useStore } from '$lib/stores';

interface SwitchProps {
	state: boolean;
	onChange: (state: boolean) => void;
	id?: string;
	ariaLabelledbyId?: string;
}

export default function Switch({ state, onChange, id = '', ariaLabelledbyId = '' }: SwitchProps) {
	const { settings } = useStore();

	return (
		<button
			id={id}
			aria-labelledby={ariaLabelledbyId}
			role="switch"
			aria-checked={state}
			className={`flex h-[1.125rem] min-h-[1.125rem] w-8 shrink-0 cursor-pointer items-center rounded-full px-1 mx-[1px] transition ${
				(settings?.highContrastMode ?? false)
					? 'focus:outline focus:outline-2 focus:outline-gray-800 focus:dark:outline-gray-200'
					: 'outline outline-1 outline-gray-100 dark:outline-gray-800'
			} ${state ? 'bg-emerald-500 dark:bg-emerald-700' : 'bg-gray-200 dark:bg-transparent'}`}
			onClick={() => onChange(!state)}
		>
			<span
				className={`pointer-events-none block size-3 shrink-0 rounded-full bg-white transition-transform ${
					state ? 'translate-x-3' : 'translate-x-0'
				} ${!state ? 'shadow-mini' : ''}`}
			/>
		</button>
	);
}
