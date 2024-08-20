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
  
      // Llenar la tabla en el modal
      const tablaPrecios = document.getElementById('tablaPrecios').getElementsByTagName('tbody')[0];
      tablaPrecios.innerHTML = ''; // Limpiar contenido previo
  
      data.precios.forEach(precio => {
        const row = tablaPrecios.insertRow();
        row.insertCell(0).textContent = precio.year;
        row.insertCell(1).textContent = `$${precio.price.toLocaleString()}`;
      });
  
      // Mostrar el modal de Bootstrap
      const modal = new bootstrap.Modal(document.getElementById('preciosModal'));
      modal.show();
  
    } catch (error) {
      console.error('Error al cargar los precios:', error.message);
  
      // Mostrar un mensaje de error básico
      alert('No tenemos disponible actualmente precios para este modelo.');
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
  
      if (!data || !data.precios || data.precios.length === 0) {
        // Si no hay precios disponibles, mostrar un mensaje usando un alert simple de JavaScript
        alert('No hay precios actualmente para el modelo 0km. Consulte nuevamente.');
        return;
      }
  
      // Llenar la tabla en el modal
      const tablaPrecios = document.getElementById('tablaPrecios').getElementsByTagName('tbody')[0];
      tablaPrecios.innerHTML = ''; // Limpiar contenido previo
  
      data.precios.forEach(precio => {
        const row = tablaPrecios.insertRow();
        row.insertCell(0).textContent = precio.year;
        row.insertCell(1).textContent = `$${precio.price.toLocaleString()}`;
      });
  
      // Mostrar el modal de Bootstrap
      const modal = new bootstrap.Modal(document.getElementById('preciosModal'));
      modal.show();
  
    } catch (error) {
      console.error('Error al cargar los precios:', error.message);
  
      // Mostrar un mensaje de error básico
      alert('No tenemos disponible actualmente precios para este modelo en 0km.');
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
