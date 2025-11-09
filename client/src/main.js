// Simple app registry + dynamic loader
const App = {
  modules: {},
  register(name, module) {
    this.modules[name] = module;
  },
  async load(name, params = {}) {
    const container = document.getElementById('viewContainer');
    container.innerHTML = ''; // limpiar

    // show loading
    const loader = document.createElement('div');
    loader.className = 'py-12 text-center text-gray-500';
    loader.textContent = 'Cargando...';
    container.appendChild(loader);

    // si ya está registrado, usarlo
    if (this.modules[name]) {
      container.innerHTML = '';
      await this.modules[name].render(container, params);
      return;
    }

    // intenta importar dinámicamente desde la ruta convencionada
    try {
      const modPath = `./pages/${name}/${name}.js`;
      const mod = await import(modPath);
      if (mod && typeof mod.render === 'function') {
        this.register(name, mod);
        container.innerHTML = '';
        await mod.render(container, params);
      } else if (mod && typeof mod.default === 'function') {
        // soporte para export default
        this.register(name, { render: mod.default });
        container.innerHTML = '';
        await mod.default(container, params);
      } else {
        throw new Error('Módulo inválido: falta exportar render(container, params)');
      }
    } catch (err) {
      container.innerHTML = '';
      const errEl = document.createElement('div');
      errEl.className = 'p-6 bg-red-50 text-red-700 rounded';
      errEl.textContent = 'Error cargando módulo "' + name + '": ' + err.message;
      container.appendChild(errEl);
      console.error(err);
    }
  }
};

// Manejo de la UI: nav y sidebar
function setupUI() {
  document.querySelectorAll('[data-module]').forEach(el => {
    el.addEventListener('click', ev => {
      ev.preventDefault();
      const name = el.getAttribute('data-module');
      App.load(name);
      // close mobile sidebar
      const sb = document.getElementById('sidebar');
      if (sb.classList.contains('hidden')) return;
    });
  });

  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    sb.classList.toggle('hidden');
  });
}

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  setupUI();
  // Cargar ruta por defecto
  App.load('pedidos');
});

export default App;