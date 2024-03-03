import GetCampus from '@/components/getCompus';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<h1 className='text-4xl font-bold'>Welcome to my app 42 API</h1>
			<GetCampus />
		</main>
	);
}
