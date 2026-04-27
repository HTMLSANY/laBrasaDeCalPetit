/* ================================================================
   MENU.JS — Filtros de categoría e interactividad de la carta
   La Brasa de Cal Petit
   ================================================================ */

(function () {
  'use strict';

  const filtroBtns = document.querySelectorAll('.filtro-btn');
  const platos     = document.querySelectorAll('.plato-card');

  if (!filtroBtns.length) return;

  /* ----------------------------------------------------------------
     FILTRAR POR CATEGORÍA
     ---------------------------------------------------------------- */
  function filtrar(categoria) {
    platos.forEach(plato => {
      const coincide = categoria === 'todos' || plato.dataset.categoria === categoria;

      if (coincide) {
        plato.classList.remove('plato-card--oculto');
      } else {
        plato.classList.add('plato-card--oculto');
      }
    });
  }

  filtroBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      /* Actualizar botón activo */
      filtroBtns.forEach(b => b.classList.remove('filtro-btn--active'));
      this.classList.add('filtro-btn--active');

      filtrar(this.dataset.categoria);
    });
  });

})();
