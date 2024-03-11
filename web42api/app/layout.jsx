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
	Image: '/42_logo_api.png',
	authors: ['Blagabo', 'gblanco-'],
	openGraph: {
		title: 'API 42',
		description: 'API 42 Network',
		url: 'https://42api-one.vercel.app',
		siteName: 'API 42',
		images: [
			{
				url: 'https://42api-one.vercel.app/42_logo_api.png',
				width: 138,
				height: 97,
			},
		],
		locale: 'es_ES',
		type: 'website',
		authors: ['Blagabo', 'gblanco-'],
	},
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
