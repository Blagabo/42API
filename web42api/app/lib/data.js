const axios = require('axios');
require('dotenv').config();

let accessToken;

const getToken = async () => {
	const tokenEndpoint = 'oauth/token';
	const tokenUrl = process.env.NEXT_PUBLIC_APIURL + tokenEndpoint;

	const data = {
		grant_type: 'client_credentials',
		client_id: process.env.NEXT_PUBLIC_CLIENTID,
		client_secret: process.env.NEXT_PUBLIC_CLIENTSECRET,
	};

	try {
		const response = await axios.post(tokenUrl, new URLSearchParams(data), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		accessToken = response.data.access_token;
	} catch (error) {
		console.error(
			'Error al obtener el token:',
			error.response ? error.response.data : error.message,
		);
	}

	return accessToken;
};

/*const getDataToken = async (endpoint, queryParams) => {
	const urlCompleta = apiUrl + endpoint;

	try {
		const response = await axios.get(urlCompleta, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			params: queryParams,
		});

		const data = response.data;
		console.log('Datos de la API:', data);
	} catch (error) {
		console.error(
			'Error al obtener datos de la API:',
			error.response ? error.response.data : error.message,
		);
	}
};*/

const fetchBlackHold = async id => {
	const token = await getToken();
	const apiUrl = `https://api.intra.42.fr/v2/users/${id}/cursus_users`;
	try {
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = response.data;
		return data;
	} catch (error) {
		console.error('Error al realizar la solicitud:', error);
	}
};

const fetchHours = async (id, startDate, endDate) => {
	const token = await getToken();

	const formattedStartDate = startDate.toISOString();
	const formattedEndDate = endDate.toISOString();

	const apiUrl = `https://api.intra.42.fr/v2/users/${id}/locations?range[end_at]=${formattedStartDate},${formattedEndDate}`;

	try {
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = response.data;
		return data;
	} catch (error) {
		console.error('Error al realizar la solicitud:', error);
	}
};

const fetchProjects = async (id, startDate, endDate) => {
	const token = await getToken();
	const apiUrl = `${process.env.NEXT_PUBLIC_APIURL}/v2/users/${id}/projects_users?filter[status]=finished&filter[cursus]=21&range[updated_at]=${startDate.toISOString()},${endDate.toISOString()}`;
	try {
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = response.data;
		return data;
	} catch (error) {
		console.error('Error al realizar la solicitud:', error);
	}
};

function getNextFriday() {
	const today = new Date('2024-02-23T08:00:00.000Z');
	const daysUntilFriday = (5 - today.getDay() + 7) % 7;
	const nextFriday = new Date(today);
	nextFriday.setDate(today.getDate() + daysUntilFriday);
	nextFriday.setHours(8, 0, 0, 0);

	return nextFriday;
}

function calculateTotalHours(data) {
	return data.reduce((totalHours, entry) => {
		const beginDate = new Date(entry.begin_at);
		const endDate = new Date(entry.end_at);
		const differenceInHours = (endDate - beginDate) / (1000 * 60 * 60);
		return parseFloat((totalHours + differenceInHours).toFixed(2));
	}, 0);
}

async function totalHours(id) {
	const startDate = getNextFriday();
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 14);
	const locationsData = await fetchHours(id, startDate, endDate);
	const totalHours = calculateTotalHours(locationsData);
	return totalHours;
}

const isInLastDays = async ({ id }) => {
	const currentDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 90);
	const data = await fetchProjects(id, startDate, currentDate);
	const name = data[0].project.name;
	const dataProjectDate = new Date(data[0].updated_at);
	const timeDifference = currentDate - dataProjectDate;
	const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
	const isInLast90Days = daysDifference <= 90;

	return { isInLast90Days, name };
};

module.exports = {
	getToken,
	//getDataToken,
	fetchBlackHold,
	fetchHours,
	fetchProjects,
	totalHours,
	isInLastDays,
};
