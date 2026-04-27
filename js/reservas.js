/* ================================================================
   RESERVAS.JS — Lógica del formulario de reservas con Supabase
   La Brasa de Cal Petit
   ================================================================ */

(function () {
  'use strict';

  const form       = document.getElementById('reservasForm');
  const btnEnviar  = document.getElementById('btnEnviar');
  const btnText    = btnEnviar?.querySelector('.btn__text');
  const btnLoading = btnEnviar?.querySelector('.btn__loading');
  const msgExito   = document.getElementById('mensajeExito');
  const msgError   = document.getElementById('mensajeError');

  if (!form) return;

  /* Fijar fecha mínima al día de hoy */
  const inputFecha = document.getElementById('fecha');
  if (inputFecha) {
    inputFecha.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  /* ----------------------------------------------------------------
     VALIDACIÓN INDIVIDUAL DE CAMPOS
     ---------------------------------------------------------------- */

  function marcarCampo(campo, error, valido, mensaje) {
    if (!campo) return valido;
    campo.classList.toggle('form__input--error',  !valido);
    campo.classList.toggle('form__select--error', !valido);
    if (error) error.textContent = valido ? '' : mensaje;
    return valido;
  }

  function validarCampo(id, mensaje) {
    const campo = document.getElementById(id);
    const error = document.getElementById('error' + capitalizar(id));
    const valido = Boolean(campo?.value.trim());
    return marcarCampo(campo, error, valido, mensaje);
  }

  function validarEmail(id) {
    const campo = document.getElementById(id);
    const error = document.getElementById('error' + capitalizar(id));
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valido = regex.test(campo?.value.trim() ?? '');
    return marcarCampo(campo, error, valido, 'Introduce un correo electrónico válido');
  }

  function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function validarTodo() {
    return [
      validarCampo('nombre',   'El nombre es obligatorio'),
      validarCampo('telefono', 'El teléfono es obligatorio'),
      validarEmail('email'),
      validarCampo('fecha',    'Selecciona una fecha'),
      validarCampo('hora',     'Selecciona una hora'),
      validarCampo('personas', 'Indica el número de personas'),
    ].every(Boolean);
  }

  /* Limpiar error individual al escribir */
  form.querySelectorAll('.form__input, .form__select, .form__textarea').forEach(campo => {
    campo.addEventListener('input', () => {
      campo.classList.remove('form__input--error', 'form__select--error', 'form__textarea--error');
      const errorEl = document.getElementById('error' + capitalizar(campo.id));
      if (errorEl) errorEl.textContent = '';
    });
  });

  /* ----------------------------------------------------------------
     CONTROL DEL ESTADO DEL BOTÓN
     ---------------------------------------------------------------- */
  function setEnviando(enviando) {
    btnEnviar.disabled   = enviando;
    if (btnText)    btnText.hidden    =  enviando;
    if (btnLoading) btnLoading.hidden = !enviando;
  }

  /* ----------------------------------------------------------------
     MOSTRAR / OCULTAR MENSAJES DE RESULTADO
     ---------------------------------------------------------------- */
  function mostrarMensaje(tipo) {
    msgExito.hidden = tipo !== 'exito';
    msgError.hidden = tipo !== 'error';

    if (tipo) {
      const el = tipo === 'exito' ? msgExito : msgError;
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ----------------------------------------------------------------
     ENVÍO A SUPABASE
     ---------------------------------------------------------------- */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    mostrarMensaje(null);

    if (!validarTodo()) return;

    setEnviando(true);

    const datos = {
      nombre:   document.getElementById('nombre').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email:    document.getElementById('email').value.trim(),
      fecha:    document.getElementById('fecha').value,
      hora:     document.getElementById('hora').value,
      personas: parseInt(document.getElementById('personas').value, 10),
      notas:    document.getElementById('notas').value.trim() || null,
    };

    try {
      const { error } = await supabaseClient
        .from('reservas')
        .insert([datos]);

      if (error) throw error;

      mostrarMensaje('exito');
      form.reset();

    } catch (err) {
      console.error('Error al guardar la reserva:', err);
      mostrarMensaje('error');

    } finally {
      setEnviando(false);
    }
  });

})();
