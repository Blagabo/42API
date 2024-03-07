import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { fetchBlackHold, isInLastDays, totalHours } from '../lib/data';

import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Progress,
} from '@nextui-org/react';
import CheckProject from '@/components/checkProject';
import HoursCount from '@/components/HoursCount';
import { Suspense } from 'react';

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
	const hours = await totalHours(id);
	const { isInLast90Days: validProject } = await isInLastDays({ id });
	let apto = false;

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

		if (daysRemaining <= 42 && hours >= 12 && validProject === true) {
			apto = true;
		} else {
			apto = false;
		}

		return (
			<div className='mt-5'>
				<h1 className='text-center font-bold text-2xl'>WHITENOVA</h1>
				<div className='flex justify-center'>
					<div className='flex flex-col items-center m-8 px-10 sm:flex-row'>
						<Card className='max-w-lg m-2 w-72 sm:w-[18rem]'>
							<CardHeader className='flex gap-3'>
								<div className='flex flex-col'>
									<p className='text-medium text-center'>Fecha de Blackhold</p>
									<p className='text-medium text-default-500'>
										{formattedDate}
									</p>
								</div>
							</CardHeader>
							<Divider />
							<CardBody>
								<p>📅 Dias Restantes: {daysRemaining}</p>
							</CardBody>
							<Divider />
							<CardFooter>
								<CheckProject id={session?.user.login} />
							</CardFooter>
						</Card>
						<Divider orientation='vertical' className='m-2 hidden sm:block' />
						<Divider orientation='horizontal' className='m-2 sm:hidden' />
						<div className='flex flex-col justify-center'>
							<Suspense
								fallback={
									<Progress
										isIndeterminate
										label='⏲ Horas WhiteNova'
										size='md'
										radius='md'
										aria-label='Loading...'
										className='p-4'
									/>
								}
							>
								<HoursCount Hours={hours} />
							</Suspense>
							<Divider orientation='horizontal' className='m-2 w-72' />
							<p className='text-center font-semibold text-lg m-3'>
								{apto === true
									? '✅ APTO PARA WHITENOVA'
									: '❌ NO APTO PARA WHITENOVA'}
							</p>
						</div>
					</div>
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
