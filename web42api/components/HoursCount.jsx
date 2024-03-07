import { fetchHours } from '@/app/lib/data';
import { Progress } from '@nextui-org/react';

async function HoursCount({ Hours }) {
	//console.log(startDate, endDate); // 2024-02-23T08:00:00.000Z 2024-03-08T08:00:00.000Z
	//await new Promise(r => setTimeout(r, 2000));
	let color = 'primary';
	if (Hours >= 12) {
		color = 'success';
	}

	return (
		<Progress
			label='⏲ Horas WhiteNova'
			value={Hours}
			maxValue={12}
			minValue={0}
			size='md'
			radius='md'
			showValueLabel={true}
			formatOptions={{ style: 'decimal' }}
			className='p-4'
			color={color}
		/>
	);
}

export default HoursCount;
