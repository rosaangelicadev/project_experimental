// Módulo de ejemplo: pedidos
export async function render(container, params = {}) {
  // contenedor base
  const title = document.createElement('h1');
  title.className = 'text-2xl font-semibold mb-4';
  title.textContent = 'Pedidos';

  const card = document.createElement('div');
  card.className = 'bg-white shadow rounded p-4';

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'overflow-x-auto';

  const table = document.createElement('table');
  table.className = 'min-w-full divide-y divide-gray-200';

  table.innerHTML = `
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200" id="pedidosBody">
      <tr>
        <td class="px-6 py-4 text-sm text-gray-500" colspan="4">Cargando...</td>
      </tr>
    </tbody>
  `;

  tableWrapper.appendChild(table);
  card.appendChild(tableWrapper);

  container.appendChild(title);
  container.appendChild(card);

  // Simular fetch a API
  try {
    const data = await fetchPedidos();
    const tbody = table.querySelector('#pedidosBody');
    tbody.innerHTML = '';
    if (!data || data.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="px-6 py-4 text-sm text-gray-500" colspan="4">No hay pedidos</td>`;
      tbody.appendChild(tr);
      return;
    }

    data.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.id}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${escapeHtml(p.cliente)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${escapeHtml(p.estado)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.total}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    const tbody = table.querySelector('#pedidosBody');
    tbody.innerHTML = `
      <tr>
        <td class="px-6 py-4 text-sm text-red-600" colspan="4">Error al cargar: ${err.message}</td>
      </tr>
    `;
    console.error(err);
  }
}

// Función simulada para obtener pedidos. En producción cambiar por fetch('/api/pedidos') etc.
async function fetchPedidos() {
  // Simular retardo
  await new Promise(r => setTimeout(r, 700));
  // Datos simulados
  return [
    { id: 1, cliente: 'Juan Pérez', estado: 'Pendiente', total: '€120.00' },
    { id: 2, cliente: 'María López', estado: 'Enviado', total: '€75.50' },
    { id: 3, cliente: 'ACME Corp', estado: 'Entregado', total: '€430.00' }
  ];
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}