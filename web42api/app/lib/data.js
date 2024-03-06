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

module.exports = {
	getToken,
	//getDataToken,
	fetchBlackHold,
	fetchHours,
};
