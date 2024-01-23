require('dotenv').config()
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ACCESSTOKEN ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwNjAyMzg5OCwianRpIjoiMGZkMDI3MTgtZTA5YS00NjJkLTk0OWYtOTE4MzJhZWJlNWY3IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjozOTEsIm5iZiI6MTcwNjAyMzg5OCwiZXhwIjoxNzA2MDI3NDk4LCJyb2xlcyI6W3siaWQiOjExLCJuYW1lIjoiMGttIn0seyJpZCI6MTksIm5hbWUiOiJEZXNhcnJvbGxvIn0seyJpZCI6MTAsIm5hbWUiOiJFeHRyYXMifSx7ImlkIjo5LCJuYW1lIjoiTW9kZWxvcyJ9LHsiaWQiOjEyLCJuYW1lIjoiVXNhZG9zIn1dfQ.97rR082v1k7tELhSHz3yqyy_1TgdsWpHaCn7yJ63SHc'
const app = express();

const PORT =process.env.PORT

//Agregamos cambios al access token
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/obtener-marcas', async (req, res) => {
  console.log('Recibida solicitud para obtener marcas');
  try {
    const apiUrl = 'https://api.infoauto.com.ar/cars/pub/';

    const allData = await obtenerTodasLasMarcas(apiUrl, ACCESSTOKEN);

    console.log('Marcas obtenidas:', allData.length);

    res.json({ marcas: allData });
  } catch (error) {
    console.error('Error al obtener las marcas:', error.message);
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
});

app.get('/obtener-grupos/:brandId', async (req, res) => {
  console.log(`Recibida solicitud para obtener grupos de la marca con ID ${req.params.brandId}`);
  try {
    const apiUrl = 'https://api.infoauto.com.ar/cars/pub/';

    const brandId = req.params.brandId;

    const allData = await obtenerTodosLosGrupos(apiUrl, ACCESSTOKEN, brandId);

    console.log(`Grupos obtenidos para la marca con ID ${brandId}:`, allData);

    res.json({ grupos: allData });
  } catch (error) {
    console.error(`Error al obtener los grupos de la marca con ID ${req.params.brandId}:`, error.message);
    res.status(500).json({ error: 'Error al obtener los grupos' });
  }
});

app.get('/obtener-modelos/:brandId/:groupId', async (req, res) => {
  console.log(`Recibida solicitud para obtener modelos de la marca con ID ${req.params.brandId} y grupo con ID ${req.params.groupId}`);
  try {
    const apiUrl = 'https://api.infoauto.com.ar/cars/pub/';

    const brandId = req.params.brandId;
    const groupId = req.params.groupId;

    const allData = await obtenerTodosLosModelos(apiUrl, ACCESSTOKEN, brandId, groupId);

    console.log(`Modelos obtenidos para la marca con ID ${brandId} y grupo con ID ${groupId}:`, allData);

    res.json({ modelos: allData });
  } catch (error) {
    console.error(`Error al obtener los modelos de la marca con ID ${req.params.brandId} y grupo con ID ${req.params.groupId}:`, error.message);
    res.status(500).json({ error: 'Error al obtener los modelos' });
  }
});

app.get('/obtener-precios/:codia', async (req, res) => {
  console.log(`Recibida solicitud para obtener precios del modelo con CODIA ${req.params.codia}`);
  try {
    const apiUrl = 'https://api.infoauto.com.ar/cars/pub/';

    const codia = req.params.codia;

    const allData = await obtenerTodosLosPrecios(apiUrl, ACCESSTOKEN, codia);

    console.log(`Precios obtenidos para el modelo con CODIA ${codia}:`, allData);

    res.json({ precios: allData });
  } catch (error) {
    console.error(`Error al obtener los precios del modelo con CODIA ${req.params.codia}:`, error.message);
    res.status(500).json({ error: 'Error al obtener los precios' });
  }
});

async function obtenerTodasLasMarcas(apiUrl, ACCESSTOKEN) {
  let allData = [];
  let page = 1;
  let totalPages = 1;

  // Función para obtener datos de una página específica
  async function obtenerDatosDePagina(page) {
    try {
      const response = await axios.get(`${apiUrl}/brands?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${ACCESSTOKEN}`
        }
      });

      return response.data.map(marca => ({
        BrandsId: marca.id,
        NombreMarca: marca.name
      }));
    } catch (error) {
      console.error(`Error al obtener la página ${page} de marcas:`, error.message);
      throw error;
    }
  }

  // Realizar solicitudes en paralelo usando Promise.all
  while (page <= totalPages) {
    const promises = [];
    for (let i = 0; i < 20; i++) {  // Hasta 20 solicitudes en paralelo
      promises.push(obtenerDatosDePagina(page));
      page++;
    }

    const pagesData = await Promise.all(promises);
    allData = allData.concat(...pagesData);

    if (page === 1) {
      // Establecer el número total de páginas en la primera iteración
      totalPages = pagesData[0].totalPages;
    }
  }

  return allData;
}

async function obtenerTodosLosGrupos(apiUrl, ACCESSTOKEN, brandId) {
  let allData = [];
  let page = 1;
  let totalPages = 1;

  // Función para obtener datos de una página específica
  async function obtenerDatosDePagina(page) {
    try {
      const response = await axios.get(`${apiUrl}/brands/${brandId}/groups?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${ACCESSTOKEN}`
        }
      });

      return response.data.map(grupo => ({
        GroupId: grupo.id,
        NombreGrupo: grupo.name
      }));
    } catch (error) {
      console.error(`Error al obtener la página ${page} de grupos:`, error.message);
      throw error;
    }
  }

  // Realizar solicitudes en paralelo usando Promise.all
  while (page <= totalPages) {
    const promises = [];
    for (let i = 0; i < 20; i++) {  // Hasta 20 solicitudes en paralelo
      promises.push(obtenerDatosDePagina(page));
      page++;
    }

    const pagesData = await Promise.all(promises);
    allData = allData.concat(...pagesData);

    if (page === 1) {
      // Establecer el número total de páginas en la primera iteración
      totalPages = pagesData[0].totalPages;
    }
  }

  return allData;
}

async function obtenerTodosLosModelos(apiUrl, ACCESSTOKEN, brandId, groupId) {
  let allData = [];
  let page = 1;
  let totalPages = 1;

  // Función para obtener datos de una página específica
  async function obtenerDatosDePagina(page) {
    try {
      const response = await axios.get(`${apiUrl}/brands/${brandId}/groups/${groupId}/models?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${ACCESSTOKEN}`
        }
      });

      return response.data.map(modelo => ({
        codia: modelo.codia,
        description: modelo.description
      }));
    } catch (error) {
      console.error(`Error al obtener la página ${page} de modelos:`, error.message);
      throw error;
    }
  }

  // Realizar solicitudes en paralelo usando Promise.all
  while (page <= totalPages) {
    const promises = [];
    for (let i = 0; i < 20; i++) {  // Hasta 20 solicitudes en paralelo
      promises.push(obtenerDatosDePagina(page));
      page++;
    }

    const pagesData = await Promise.all(promises);
    allData = allData.concat(...pagesData);

    if (page === 1) {
      // Establecer el número total de páginas en la primera iteración
      totalPages = pagesData[0].totalPages;
    }
  }

  return allData;
}

async function obtenerTodosLosPrecios(apiUrl, ACCESSTOKEN, codia) {
  try {
    const response = await axios.get(`${apiUrl}/models/${codia}/prices`, {
      headers: {
        'Authorization': `Bearer ${ACCESSTOKEN}`
      }
    });

    return response.data.map(precio => ({
      year: precio.year,
      price: precio.price*1000
    }));
  } catch (error) {
    console.error(`Error al obtener los precios del modelo con CODIA ${codia}:`, error.message);
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


/* 
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT;
const TOKEN_FILE_PATH = path.join(__dirname, 'refreshToken.json');

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Función para cargar el token desde el archivo
async function loadAccessToken() {
  try {
    const refreshToken = await fs.readFile(TOKEN_FILE_PATH, 'utf-8');
    const response = await axios.post('https://api.infoauto.com.ar/cars/auth/refresh', {
      refresh_token: refreshToken
    });
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error al cargar el token:', error.message);
    throw error;
  }
}

// Middleware para cargar el token antes de manejar las solicitudes
app.use(async (req, res, next) => {
  try {
    const accessToken = await loadAccessToken();
    req.accessToken = accessToken;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el token' });
  }
});

app.get('/obtener-marcas', async (req, res) => {
  // Acceder al token a través de req.accessToken
  const ACCESSTOKEN = req.accessToken;

  console.log('Recibida solicitud para obtener marcas');
  try {
    const apiUrl = 'https://api.infoauto.com.ar/cars/pub/';
    const allData = await obtenerTodasLasMarcas(apiUrl, ACCESSTOKEN);
    console.log('Marcas obtenidas:', allData.length);
    res.json({ marcas: allData });
  } catch (error) {
    console.error('Error al obtener las marcas:', error.message);
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
});

app.get('/obtener-grupos/:brandId', async (req, res) => {
  // Acceder al token a través de req.accessToken
  const ACCESSTOKEN = req.accessToken;

  console.log(`Recibida solicitud para obtener grupos de la marca con ID ${req.params.brandId}`);
  try {
    const apiUrl = 'https://api.infoauto.com.ar/cars/pub/';
    const brandId = req.params.brandId;
    const allData = await obtenerTodosLosGrupos(apiUrl, ACCESSTOKEN, brandId);
    console.log(`Grupos obtenidos para la marca con ID ${brandId}:`, allData);
    res.json({ grupos: allData });
  } catch (error) {
    console.error(`Error al obtener los grupos de la marca con ID ${req.params.brandId}:`, error.message);
    res.status(500).json({ error: 'Error al obtener los grupos' });
  }
});

app.get('/obtener-modelos/:brandId/:groupId', async (req, res) => {
  // Acceder al token a través de req.accessToken
  const ACCESSTOKEN = req.accessToken;

  console.log(`Recibida solicitud para obtener modelos de la marca con ID ${req.params.brandId} y grupo con ID ${req.params.groupId}`);
  try {
    const apiUrl = 'https://api.infoauto.com.ar/cars/pub/';
    const brandId = req.params.brandId;
    const groupId = req.params.groupId;
    const allData = await obtenerTodosLosModelos(apiUrl, ACCESSTOKEN, brandId, groupId);
    console.log(`Modelos obtenidos para la marca con ID ${brandId} y grupo con ID ${groupId}:`, allData);
    res.json({ modelos: allData });
  } catch (error) {
    console.error(`Error al obtener los modelos de la marca con ID ${req.params.brandId} y grupo con ID ${req.params.groupId}:`, error.message);
    res.status(500).json({ error: 'Error al obtener los modelos' });
  }
});

app.get('/obtener-precios/:codia', async (req, res) => {
  // Acceder al token a través de req.accessToken
  const ACCESSTOKEN = req.accessToken;

  console.log(`Recibida solicitud para obtener precios del modelo con CODIA ${req.params.codia}`);
  try {
    const apiUrl = 'https://api.infoauto.com.ar/cars/pub/';
    const codia = req.params.codia;
    const allData = await obtenerTodosLosPrecios(apiUrl, ACCESSTOKEN, codia);
    console.log(`Precios obtenidos para el modelo con CODIA ${codia}:`, allData);
    res.json({ precios: allData });
  } catch (error) {
    console.error(`Error al obtener los precios del modelo con CODIA ${req.params.codia}:`, error.message);
    res.status(500).json({ error: 'Error al obtener los precios' });
  }
});

async function obtenerTodasLasMarcas(apiUrl, ACCESSTOKEN) {
  let allData = [];
  let page = 1;
  let totalPages = 1;

  // Función para obtener datos de una página específica
  async function obtenerDatosDePagina(page) {
    try {
      const response = await axios.get(`${apiUrl}/brands?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${ACCESSTOKEN}`
        }
      });

      return response.data.map(marca => ({
        BrandsId: marca.id,
        NombreMarca: marca.name
      }));
    } catch (error) {
      console.error(`Error al obtener la página ${page} de marcas:`, error.message);
      throw error;
    }
  }

  // Realizar solicitudes en paralelo usando Promise.all
  while (page <= totalPages) {
    const promises = [];
    for (let i = 0; i < 20; i++) {  // Hasta 20 solicitudes en paralelo
      promises.push(obtenerDatosDePagina(page));
      page++;
    }

    const pagesData = await Promise.all(promises);
    allData = allData.concat(...pagesData);

    if (page === 1) {
      // Establecer el número total de páginas en la primera iteración
      totalPages = pagesData[0].totalPages;
    }
  }

  return allData;
}


async function obtenerTodosLosGrupos(apiUrl, ACCESSTOKEN, brandId) {
  let allData = [];
  let page = 1;
  let totalPages = 1;

  // Función para obtener datos de una página específica
  async function obtenerDatosDePagina(page) {
    try {
      const response = await axios.get(`${apiUrl}/brands/${brandId}/groups?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${ACCESSTOKEN}`
        }
      });

      return response.data.map(grupo => ({
        GroupId: grupo.id,
        NombreGrupo: grupo.name
      }));
    } catch (error) {
      console.error(`Error al obtener la página ${page} de grupos:`, error.message);
      throw error;
    }
  }

  // Realizar solicitudes en paralelo usando Promise.all
  while (page <= totalPages) {
    const promises = [];
    for (let i = 0; i < 20; i++) {  // Hasta 20 solicitudes en paralelo
      promises.push(obtenerDatosDePagina(page));
      page++;
    }

    const pagesData = await Promise.all(promises);
    allData = allData.concat(...pagesData);

    if (page === 1) {
      // Establecer el número total de páginas en la primera iteración
      totalPages = pagesData[0].totalPages;
    }
  }

  return allData;
}

async function obtenerTodosLosModelos(apiUrl, ACCESSTOKEN, brandId, groupId) {
  let allData = [];
  let page = 1;
  let totalPages = 1;

  // Función para obtener datos de una página específica
  async function obtenerDatosDePagina(page) {
    try {
      const response = await axios.get(`${apiUrl}/brands/${brandId}/groups/${groupId}/models?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${ACCESSTOKEN}`
        }
      });

      return response.data.map(modelo => ({
        codia: modelo.codia,
        description: modelo.description
      }));
    } catch (error) {
      console.error(`Error al obtener la página ${page} de modelos:`, error.message);
      throw error;
    }
  }

  // Realizar solicitudes en paralelo usando Promise.all
  while (page <= totalPages) {
    const promises = [];
    for (let i = 0; i < 20; i++) {  // Hasta 20 solicitudes en paralelo
      promises.push(obtenerDatosDePagina(page));
      page++;
    }

    const pagesData = await Promise.all(promises);
    allData = allData.concat(...pagesData);

    if (page === 1) {
      // Establecer el número total de páginas en la primera iteración
      totalPages = pagesData[0].totalPages;
    }
  }

  return allData;
}


async function obtenerTodosLosPrecios(apiUrl, ACCESSTOKEN, codia) {
  try {
    const response = await axios.get(`${apiUrl}/models/${codia}/prices`, {
      headers: {
        'Authorization': `Bearer ${ACCESSTOKEN}`
      }
    });

    return response.data.map(precio => ({
      year: precio.year,
      price: precio.price*1000
    }));
  } catch (error) {
    console.error(`Error al obtener los precios del modelo con CODIA ${codia}:`, error.message);
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});




*/ 