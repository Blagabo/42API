import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { Providers } from './context/Providers';
import AppNavbar from '@/components/appNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'API 42',
	description: 'API 42 Network',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en' className='dark'>
			<link rel='icon' href='/favicon.ico' />
			<body className={`${inter.className} antialiased`}>
				<Providers>
					<AppNavbar />
					{children}
					<Analytics />
					<SpeedInsights />
				</Providers>
			</body>
		</html>
	);
}
