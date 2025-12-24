import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '$lib/stores';
import { initI18n } from '$lib/i18n';
import Layout from './components/Layout';
import Chat from './components/Chat';

function getSystemTheme(): string {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(themeValue: string) {
	let themeToApply = themeValue;
	if (themeValue === 'system') {
		themeToApply = getSystemTheme();
	} else if (themeValue === 'oled-dark') {
		themeToApply = 'dark';
	}
	document.documentElement.classList.remove('dark', 'light', 'oled-dark');
	document.documentElement.classList.add(themeToApply);
	if (themeValue === 'oled-dark') {
		document.documentElement.style.setProperty('--color-gray-800', '#101010');
		document.documentElement.style.setProperty('--color-gray-850', '#050505');
		document.documentElement.style.setProperty('--color-gray-900', '#000000');
		document.documentElement.style.setProperty('--color-gray-950', '#000000');
	} else if (themeToApply === 'dark') {
		document.documentElement.style.setProperty('--color-gray-800', '#333');
		document.documentElement.style.setProperty('--color-gray-850', '#262626');
		document.documentElement.style.setProperty('--color-gray-900', '#171717');
		document.documentElement.style.setProperty('--color-gray-950', '#0d0d0d');
	}
	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (metaThemeColor) {
		metaThemeColor.setAttribute('content', themeToApply === 'light' ? '#ffffff' : themeValue === 'oled-dark' ? '#000000' : '#171717');
	}
}

export default function App() {
	const { theme, setTheme, setMobile, WEBUI_NAME } = useStore();
	const BREAKPOINT = 768;

	useEffect(() => {
		initI18n('pl-PL');
		applyTheme(theme);

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			if (theme === 'system') {
				applyTheme('system');
			}
		};
		mediaQuery.addEventListener('change', handleChange);

		const handleResize = () => setMobile(window.innerWidth < BREAKPOINT);
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
			window.removeEventListener('resize', handleResize);
		};
	}, [theme, setMobile]);

	useEffect(() => {
		document.title = WEBUI_NAME;
	}, [WEBUI_NAME]);

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Chat />} />
				<Route path="c/:id" element={<Chat />} />
			</Route>
		</Routes>
	);
}
