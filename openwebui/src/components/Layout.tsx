import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '$lib/stores';
import Sidebar from './Sidebar';

export default function Layout() {
	const { showSidebar, mobile, setTools, setFunctions, setTags, setToolServers } = useStore();

	useEffect(() => {
		setTools([]);
		setFunctions([]);
		setTags([]);
		setToolServers([]);
	}, [setTools, setFunctions, setTags, setToolServers]);

	return (
		<div className="app relative">
			<div
				className="text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 h-screen max-h-[100dvh] flex flex-row transition-all duration-300 overflow-hidden"
				style={{ '--sidebar-width': showSidebar ? '260px' : '48px' } as React.CSSProperties}
			>
				<Sidebar />
				<div
					className="app-content-wrapper"
					style={mobile && showSidebar ? { transform: 'translateX(260px)', minWidth: '100vw' } : {}}
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
