 

  function consultarTodasLasMarcas() {
    const apiUrl = '/obtener-marcas';

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        llenarMarcasEnDropdown(data.marcas);
        console.log('Marcas obtenidas:', data.marcas.length);
      })
      .catch(error => {
        console.error('Error al cargar las marcas:', error);
        // Manejar el error según tus necesidades
      });
  }

  function llenarMarcasEnDropdown(marcas) {
    const brandDropdown = document.getElementById('brandDropdown');

    // Limpiar opciones antiguas
    brandDropdown.innerHTML = '<option value="">Seleccione una marca</option>';

    // Llenar opciones con las marcas recibidas
    marcas.forEach(marca => {
      const option = document.createElement('option');
      option.value = marca.BrandsId;
      option.textContent = marca.NombreMarca;
      brandDropdown.appendChild(option);
    });
  }

  async function llenarGruposEnDropdown(brandId) {
    const apiUrlGrupos = `/obtener-grupos/${brandId}`;

    try {
      const response = await fetch(apiUrlGrupos);
      const data = await response.json();

      const groupDropdown = document.getElementById('groupDropdown');

      // Limpiar opciones antiguas
      groupDropdown.innerHTML = '<option value="">Seleccione un grupo</option>';

      // Llenar opciones con los grupos recibidos
      data.grupos.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.GroupId;
        option.textContent = grupo.NombreGrupo;
        groupDropdown.appendChild(option);
      });

      console.log('Grupos obtenidos:', data.grupos.length);
    } catch (error) {
      console.error('Error al cargar los grupos:', error);
      // Manejar el error según tus necesidades
    }
  }

  function cambiarMarca() {
    const brandDropdown = document.getElementById('brandDropdown');
    const selectedBrandId = brandDropdown.value;

    if (selectedBrandId) {
      llenarGruposEnDropdown(selectedBrandId);
    }
  }

  async function buscarModelosUsados() {
    const brandDropdown = document.getElementById('brandDropdown');
    const groupDropdown = document.getElementById('groupDropdown');
    const selectedBrandId = brandDropdown.value;
    const selectedGroupId = groupDropdown.value;

    if (!selectedBrandId) {
      alert('Seleccione una marca antes de buscar modelos.');
      return;
    }

    if (!selectedGroupId) {
      alert('Seleccione un grupo antes de buscar modelos.');
      return;
    }

    const apiUrlModelos = `/obtener-modelos-usados/${selectedBrandId}/${selectedGroupId}`;

    try {
      const response = await fetch(apiUrlModelos);
      const data = await response.json();

      console.log('Modelos obtenidos:', data.modelos);

      // Mostrar modelos en una tabla (puedes adaptar esta parte según tu necesidad)
      const modelosTable = document.getElementById('modelos-table');
      modelosTable.innerHTML = '<thead><tr><th>CODIA</th><th>Descripción</th><th>Ver Precios</th></tr></thead><tbody></tbody>';

      data.modelos.forEach(modelo => {
        const row = modelosTable.querySelector('tbody').insertRow();
        row.insertCell(0).textContent = modelo.codia;
        row.insertCell(1).textContent = modelo.description;

        // Botón para ver precios
        const btnVerPrecios = document.createElement('button');
        btnVerPrecios.textContent = 'Ver Precios';
        btnVerPrecios.onclick = () => verPreciosUsados(modelo.codia);
        row.insertCell(2).appendChild(btnVerPrecios);
      });
    } catch (error) {
      console.error('Error al cargar los modelos:', error);
      // Manejar el error según tus necesidades
    }
  }

 
  async function verPreciosUsados(codia) {
  const apiUrlPrecios = `/obtener-precios-usados/${codia}`;

  try {
    const response = await fetch(apiUrlPrecios);
    const data = await response.json();

    console.log('Precios obtenidos:', data.precios);

    // Construir un array de objetos para SweetAlert2
    const preciosOptions = data.precios.map(precio => ({
      // Este será el valor interno
      text: `$${precio.price}`, // Este será el valor visualmente mostrado
      year: precio.year, // Añadir una propiedad year al objeto
    }));

    // Mostrar SweetAlert2 con un desplegable
    const { value: selectedPrice } = await Swal.fire({
      title: 'Selecciona un precio para ver el año',
      input: 'select',
      inputOptions: preciosOptions.reduce((acc, precio) => {
        if (!acc[precio.year]) {
          acc[precio.year] = []; // Inicializar el grupo si no existe
        }
        acc[precio.year].push(`${precio.text}`); // Añadir la opción al grupo
        return acc;
      }, {}),
      inputPlaceholder: 'Seleccione un precio',
    });

    // Verificar si se seleccionó un precio
    if (selectedPrice) {
      // Aquí puedes realizar cualquier acción adicional con el precio seleccionado
      const selectedYear = data.precios.find(precio => precio.price === selectedPrice).year;
      Swal.fire({
        title: `Año para el precio $${selectedPrice}`,
        text: `El año es: ${selectedYear}`,
        icon: 'info',
      });
    }
  } catch (error) {
    console.error('Error al cargar los precios:', error);
    // Manejar el error según tus necesidades
  }
}

async function buscarModelos() {
    const brandDropdown = document.getElementById('brandDropdown');
    const groupDropdown = document.getElementById('groupDropdown');
    const selectedBrandId = brandDropdown.value;
    const selectedGroupId = groupDropdown.value;

    if (!selectedBrandId) {
      alert('Seleccione una marca antes de buscar modelos.');
      return;
    }

    if (!selectedGroupId) {
      alert('Seleccione un grupo antes de buscar modelos.');
      return;
    }

    const apiUrlModelos = `/obtener-casos/${selectedBrandId}/${selectedGroupId}`;

    try {
      const response = await fetch(apiUrlModelos);
      const data = await response.json();

      console.log('Modelos obtenidos:', data.modelos);

      // Mostrar modelos en una tabla (puedes adaptar esta parte según tu necesidad)
      const modelosTable = document.getElementById('modelos-table');
      modelosTable.innerHTML = '<thead><tr><th>CODIA</th><th>Descripción</th><th>Ver Precios</th></tr></thead><tbody></tbody>';

      data.modelos.forEach(modelo => {
        const row = modelosTable.querySelector('tbody').insertRow();
        row.insertCell(0).textContent = modelo.codia;
        row.insertCell(1).textContent = modelo.description;

        // Botón para ver precios
        const btnVerPrecios = document.createElement('button');
        btnVerPrecios.textContent = 'Ver Precios';
        btnVerPrecios.onclick = () => verPrecios(modelo.codia);
        row.insertCell(2).appendChild(btnVerPrecios);
      });
    } catch (error) {
      console.error('Error al cargar los modelos:', error);
      // Manejar el error según tus necesidades
    }
  }


  async function verPrecios(codia) {
  const apiUrlPrecios = `/obtener-precios/${codia}`;

  try {
    const response = await fetch(apiUrlPrecios);
    
    if (!response.ok) {
      throw new Error(`Error al cargar el list_price: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.hasOwnProperty('list_price')) {
      // Mostrar SweetAlert2 indicando que no hay precios
      Swal.fire({
        title: 'No hay precios',
        text: 'No hay precios actualmente para el modelo 0km. Consulte nuevamente.',
        icon: 'warning'
      });
      return;
    }

    const listPrice = data.list_price;

    console.log('List Price obtenido:', listPrice);

    // Mostrar SweetAlert2 con el list_price
    Swal.fire({
      title: 'Precio actual',
      text: `El precio es: ${listPrice}`,
      icon: 'success'
    });
  } catch (error) {
    console.error('Error al cargar el list_price:', error.message);

    // Mostrar SweetAlert2 indicando que hubo un error
    Swal.fire({
      title: 'Error',
      text: 'No tenemos disponible actualmente precios para este modelo en 0km.',
      icon: 'icon'
    });
  }
}


  async function buscarPreciosPorCodia() {
  const codiaInput = document.getElementById('codiaInput');
  const codia = codiaInput.value.trim();

  if (!codia) {
    alert('Por favor, ingrese un CODIA válido.');
    return;
  }

  const apiUrlPrecios = `/obtener-precios/${codia}`;

  try {
    const response = await fetch(apiUrlPrecios);
    const data = await response.json();

    console.log('Precios obtenidos por CODIA:', data.precios);

    // Mostrar precios en una tabla (puedes adaptar esta parte según tu necesidad)
    const preciosTable = document.getElementById('modelos-table');
    preciosTable.innerHTML = '<thead><tr><th>Año</th><th>Precio</th></tr></thead><tbody></tbody>';

    data.precios.forEach(precio => {
      const row = preciosTable.querySelector('tbody').insertRow();
      row.insertCell(0).textContent = precio.year;
      row.insertCell(1).textContent = precio.price;
    });
  } catch (error) {
    console.error('Error al cargar los precios por CODIA:', error);
    // Manejar el error según tus necesidades
  }
}