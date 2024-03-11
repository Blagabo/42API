import { Spinner } from '@nextui-org/react';

export default function Loading() {
	return (
		<div className='flex justify-center items-center h-3/6'>
			<Spinner size='lg' color='primary' label='Loading...' />
		</div>
	);
}
