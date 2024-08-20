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
      });
  }
  
  function llenarMarcasEnDropdown(marcas) {
    const brandDropdown = document.getElementById('brandDropdown');
    brandDropdown.innerHTML = '<option value="">Seleccione una marca</option>';
  
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
      groupDropdown.innerHTML = '<option value="">Seleccione un grupo</option>';
  
      data.grupos.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.GroupId;
        option.textContent = grupo.NombreGrupo;
        groupDropdown.appendChild(option);
      });
  
      console.log('Grupos obtenidos:', data.grupos.length);
    } catch (error) {
      console.error('Error al cargar los grupos:', error);
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
  
      const modelosTable = document.getElementById('modelos-table');
      const tbody = modelosTable.querySelector('tbody');
      tbody.innerHTML = '';
  
      data.modelos.forEach(modelo => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = modelo.codia;
        row.insertCell(1).textContent = modelo.description;
  
        const btnVerPrecios = document.createElement('button');
        btnVerPrecios.textContent = 'Ver Precios';
        btnVerPrecios.className = 'btn btn-info';
        btnVerPrecios.onclick = () => verPreciosUsados(modelo.codia);
        row.insertCell(2).appendChild(btnVerPrecios);
      });
    } catch (error) {
      console.error('Error al cargar los modelos:', error);
    }
  }
  
  async function verPreciosUsados(codia) {
    const apiUrlPrecios = `/obtener-precios-usados/${codia}`;
  
    try {
      const response = await fetch(apiUrlPrecios);
      const data = await response.json();
  
      console.log('Precios obtenidos:', data.precios);
  
      const preciosOptions = data.precios.map(precio => ({
        text: `$${precio.price}`,
        year: precio.year,
      }));
  
      const { value: selectedPrice } = await Swal.fire({
        title: 'Selecciona un precio para ver el año',
        input: 'select',
        inputOptions: preciosOptions.reduce((acc, precio) => {
          if (!acc[precio.year]) {
            acc[precio.year] = [];
          }
          acc[precio.year].push(`${precio.text}`);
          return acc;
        }, {}),
        inputPlaceholder: 'Seleccione un precio',
      });
  
      if (selectedPrice) {
        const selectedYear = data.precios.find(precio => precio.price === selectedPrice).year;
        Swal.fire({
          title: `Año para el precio $${selectedPrice}`,
          text: `El año es: ${selectedYear}`,
          icon: 'info',
        });
      }
    } catch (error) {
      console.error('Error al cargar los precios:', error);
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
  
      const modelosTable = document.getElementById('modelos-table');
      const tbody = modelosTable.querySelector('tbody');
      tbody.innerHTML = '';
  
      data.modelos.forEach(modelo => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = modelo.codia;
        row.insertCell(1).textContent = modelo.description;
  
        const btnVerPrecios = document.createElement('button');
        btnVerPrecios.textContent = 'Ver Precios';
        btnVerPrecios.className = 'btn btn-info';
        btnVerPrecios.onclick = () => verPrecios(modelo.codia);
        row.insertCell(2).appendChild(btnVerPrecios);
      });
    } catch (error) {
      console.error('Error al cargar los modelos:', error);
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
        Swal.fire({
          title: 'No hay precios',
          text: 'No hay precios actualmente para el modelo 0km. Consulte nuevamente.',
          icon: 'warning'
        });
        return;
      }
  
      const listPrice = data.list_price;
  
      Swal.fire({
        title: 'Precio actual',
        text: `El precio es: ${listPrice}`,
        icon: 'success'
      });
    } catch (error) {
      console.error('Error al cargar el list_price:', error.message);
  
      Swal.fire({
        title: 'Error',
        text: 'No tenemos disponible actualmente precios para este modelo en 0km.',
        icon: 'error'
      });
    }
  }
  
  function filtrarModelos() {
    const searchInput = document.getElementById('searchModel').value.toLowerCase();
    const table = document.getElementById('modelos-table');
    const rows = table.getElementsByTagName('tr');
  
    for (let i = 1; i < rows.length; i++) {
      const codia = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
      const description = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
  
      if (codia.includes(searchInput) || description.includes(searchInput)) {
        rows[i].style.display = '';
      } else {
        rows[i].style.display = 'none';
      }
    }
  }
  