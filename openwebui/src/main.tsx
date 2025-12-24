import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import './tailwind.css';
import './app.css';
import { useStore } from '$lib/stores';

function Root() {
	const theme = useStore((s) => s.theme);
	const toasterTheme = theme === 'system' 
		? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
		: theme === 'dark' || theme === 'oled-dark' ? 'dark' : 'light';

	return (
		<React.StrictMode>
			<BrowserRouter>
				<App />
				<Toaster theme={toasterTheme} richColors position="top-right" />
			</BrowserRouter>
		</React.StrictMode>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
