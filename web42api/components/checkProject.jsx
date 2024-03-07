import { isInLastDays } from '@/app/lib/data';
import Alert from './Alert';

const CheckProject = async ({ id }) => {
	const { isInLast90Days, name } = await isInLastDays({ id });
	try {
		if (isInLast90Days) {
			return (
				<div className='text-center'>
					<p>Tu proyecto entregado en los ultimos 90 días</p>
					<p className='text-medium font-semibold'>{name}</p>
				</div>
			);
		} else {
			return (
				<div className='text-center'>
					<p>💀 No tienes proyectos entregado en los últimos 90 días.</p>
				</div>
			);
		}
	} catch (error) {
		return (
			<div className='fixed inset-0 flex items-center justify-center'>
				<Alert message={error.message} />
			</div>
		);
	}
};

export default CheckProject;
