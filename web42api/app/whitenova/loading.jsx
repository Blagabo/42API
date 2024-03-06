import { CircularProgress } from '@nextui-org/react';

export default function Loading() {
	return (
		<div className='flex justify-center items-center h-3/6'>
			<CircularProgress size='lg' label='Loading...' />
		</div>
	);
}
