import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { fetchBlackHold } from '../lib/data';
import DayCount from '@/components/dayCount';

const options = {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
	timeZoneName: 'short',
};

export default async function blackHoldPage() {
	const session = await getServerSession(authOptions);
	const id = session?.user.id;
	const data = await fetchBlackHold(id);

	if (data.length > 0) {
		const blackholed_atString = data[0].blackholed_at;
		const blackholed_atDate = new Date(blackholed_atString);
		const currentDate = new Date();

		const differenceInMilliseconds = blackholed_atDate - currentDate;
		const differenceInDays = Math.floor(
			differenceInMilliseconds / (1000 * 60 * 60 * 24),
		);

		const formattedDate = blackholed_atDate.toLocaleDateString(
			'es-ES',
			options,
		);
		const daysRemaining = isNaN(differenceInDays)
			? 'No disponible'
			: differenceInDays;

		return (
			<div>
				<h1 className='text-center font-bold text-lg'>Blackhold</h1>
				<div className='flex justify-center'>
					<div className='flex flex-col items-center'>
						<p className='text-lg font-bold'>Fecha de Blackhold:</p>
						<p className='text-lg'>{formattedDate}</p>
						<p className='text-lg font-bold'>Días restantes:</p>
						<p className='text-lg'>{daysRemaining}</p>
					</div>
					<DayCount id={session?.user.login} />
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<h1 className='text-center font-bold text-lg'>Blackhold</h1>
				<p>No hay datos disponibles.</p>
			</div>
		);
	}
}
