const axios = require('axios');
require('dotenv').config();

let accessToken;

const getToken = async () => {
	const tokenEndpoint = 'oauth/token';
	const tokenUrl = process.env.APIURL + tokenEndpoint;

	const data = {
		grant_type: 'client_credentials',
		client_id: process.env.CLIENTID,
		client_secret: process.env.CLIENTSECRET,
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
	const apiUrl = `${process.env.APIURL}/v2/users/${id}/projects_users?filter[status]=finished&filter[cursus]=21&range[updated_at]=${startDate.toISOString()},${endDate.toISOString()}`;
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

function getCycleDates(lastWhitenovaCycleDate) {
	const lastCycleDate = new Date(lastWhitenovaCycleDate);
	const nextCycleStartDate = new Date(lastCycleDate);
	nextCycleStartDate.setDate(lastCycleDate.getDate() + 1); // Next day after the last cycle
	const nextCycleEndDate = new Date(nextCycleStartDate);
	nextCycleEndDate.setDate(nextCycleStartDate.getDate() + 13); // 14 days from the start
	const cycleDates = {
		startDate: nextCycleStartDate,
		endDate: nextCycleEndDate,
	};

	return cycleDates;
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
	const lastWhitenovaCycleDate = '2024-04-05';
	const { startDate, endDate } = getCycleDates(lastWhitenovaCycleDate);
	const locationsData = await fetchHours(id, startDate, endDate);
	const Hourstotal = calculateTotalHours(locationsData);
	return { startDate, endDate, Hourstotal };
}

const isInLastDays = async ({ id }) => {
	const currentDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 90);
	const data = await fetchProjects(id, startDate, currentDate);
	const name = data[0].project.name;
	const dataProjectDate = new Date(data[0].updated_at);
	const timeDifference = currentDate - dataProjectDate;
	let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const isInLast90Days = daysDifference <= 90;
	daysDifference = 90 - daysDifference;

	return { isInLast90Days, daysDifference, name };
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
