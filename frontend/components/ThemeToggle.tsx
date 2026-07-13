'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

type ThemeToggleProps = {
	className?: string;
};

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button
				type="button"
				aria-label="Toggle theme"
				className={`relative inline-flex h-10 w-10 items-center justify-center border-2 border-[#720000aa] bg-[#f7d9d9] text-[#720000] shadow-[2px_2px_0_0_#72000066] ${className}`.trim()}
			>
				<span className="h-5 w-5" />
			</button>
		);
	}

	const activeTheme = theme === 'system' ? resolvedTheme : theme;
	const isDark = activeTheme === 'dark';

	return (
		<button
			type="button"
			aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className={`relative inline-flex h-10 w-10 items-center justify-center border-2 border-[#720000aa] bg-[#f7d9d9] text-[#720000] shadow-[2px_2px_0_0_#72000066] transition-all duration-150 ease-out hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_#72000066] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-[#f5d7d7aa] dark:bg-[#3f1a1a] dark:text-[#ffe9e9] dark:shadow-[2px_2px_0_0_#120606] ${className}`.trim()}
		>
			<svg
				className={`absolute h-5 w-5 transition-all duration-200 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="M4.93 4.93l1.41 1.41" />
				<path d="M17.66 17.66l1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="M6.34 17.66l-1.41 1.41" />
				<path d="M19.07 4.93l-1.41 1.41" />
			</svg>
			<svg
				className={`absolute h-5 w-5 transition-all duration-200 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 1 1 12 3Z" />
			</svg>
		</button>
	);
}
