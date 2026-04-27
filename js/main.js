/* ================================================================
   MAIN.JS — Navbar con scroll, menú móvil y animaciones reveal
   La Brasa de Cal Petit
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     NAVBAR — clase scrolled + menú móvil
     ---------------------------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.navbar__link');

  /* ----------------------------------------------------------------
     ENLACE ACTIVO según la sección visible
     — declarado aquí arriba para que manejarScroll() pueda usarlo
     ---------------------------------------------------------------- */
  const secciones = document.querySelectorAll('main section[id]');

  function actualizarLinkActivo() {
    const offset = (parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--navbar-alto'), 10
    ) || 72) + 20;

    let seccionActual = '';
    secciones.forEach(sec => {
      if (sec.getBoundingClientRect().top <= offset) {
        seccionActual = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'navbar__link--active',
        link.getAttribute('href') === '#' + seccionActual
      );
    });
  }

  function manejarScroll() {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
    actualizarLinkActivo();
  }

  window.addEventListener('scroll', manejarScroll, { passive: true });
  manejarScroll(); /* aplicar estado inicial */

  /* Abrir / cerrar menú hamburguesa */
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const abierto = navMenu.classList.toggle('navbar__nav--open');
      this.setAttribute('aria-expanded', String(abierto));
      document.body.style.overflow = abierto ? 'hidden' : '';
    });
  }

  /* Cerrar menú al pulsar un enlace de navegación */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('navbar__nav--open');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ----------------------------------------------------------------
     ANIMACIONES REVEAL (Intersection Observer)
     ---------------------------------------------------------------- */
  const elementosReveal = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && elementosReveal.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); /* animar solo una vez */
          }
        });
      },
      { rootMargin: '-60px 0px', threshold: 0.1 }
    );

    elementosReveal.forEach(el => observer.observe(el));

  } else {
    /* Fallback: mostrar todo sin animación si el navegador no soporta IO */
    elementosReveal.forEach(el => el.classList.add('visible'));
  }

})();
