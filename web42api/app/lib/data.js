const axios = require("axios");
require("dotenv").config();

let accessToken;

const getToken = async () => {
  const tokenEndpoint = "oauth/token";
  const tokenUrl = process.env.NEXT_PUBLIC_APIURL + tokenEndpoint;

  const data = {
    grant_type: "client_credentials",
    client_id: process.env.NEXT_PUBLIC_CLIENTID,
    client_secret: process.env.NEXT_PUBLIC_CLIENTSECRET,
  };

  try {
    const response = await axios.post(tokenUrl, new URLSearchParams(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    accessToken = response.data.access_token;
  } catch (error) {
    console.error("Error al obtener el token:", error.response ? error.response.data : error.message);
  }

  return accessToken;
};

const getDataToken = async (endpoint, queryParams) => {
  const urlCompleta = apiUrl + endpoint;

  try {
    const response = await axios.get(urlCompleta, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: queryParams,
    });

    const datos = response.data;

    const resultadosFiltrados = datos.filter(item => item.country.includes("Spain"));
    console.log("Datos de la API (filtrados):", resultadosFiltrados);
  } catch (error) {
    console.error("Error al obtener datos de la API:", error.response ? error.response.data : error.message);
  }
};

module.exports = {
  getToken,
  getDataToken,
};

/* Ejemplo de uso
getToken()
  .then(() => getDataToken('v2/campus', queryParams))
  .catch((error) => console.error('Error general:', error)); */
