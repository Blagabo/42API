import { fetchHours } from '@/app/lib/data';

function getNextFriday() {
	const today = new Date('2024-02-23T08:00:00.000Z');
	const daysUntilFriday = (5 - today.getDay() + 7) % 7;
	const nextFriday = new Date(today);
	nextFriday.setDate(today.getDate() + daysUntilFriday);
	nextFriday.setHours(8, 0, 0, 0);

	return nextFriday;
}

async function DayCount({ id }) {
	const startDate = getNextFriday();
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 14);
	console.log(startDate, endDate); // 2024-02-23T08:00:00.000Z 2024-03-08T08:00:00.000Z

	const locationsData = await fetchHours(id, startDate, endDate);
	console.log(locationsData);
	return (
		<div>
			<h1>day Count</h1>
		</div>
	);
}

export default DayCount;
