(function () {
  var history = [];

  function buildWidget() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = [
      '<button class="chatbot-toggle" id="chatbotToggle" aria-label="Abrir asistente virtual" aria-expanded="false">',
      '  <svg class="icon-chat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      '  <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      '</button>',
      '<div class="chatbot-window" id="chatbotWindow" role="dialog" aria-label="Asistente virtual de La Brasa de Cal Petit" aria-hidden="true">',
      '  <div class="chatbot-header">',
      '    <div class="chatbot-header__avatar" aria-hidden="true">🍽️</div>',
      '    <div class="chatbot-header__info">',
      '      <div class="chatbot-header__name">La Brasa de Cal Petit</div>',
      '      <div class="chatbot-header__status">Asistente virtual · En línea</div>',
      '    </div>',
      '  </div>',
      '  <div class="chatbot-messages" id="chatbotMessages" aria-live="polite" aria-atomic="false"></div>',
      '  <form class="chatbot-form" id="chatbotForm" autocomplete="off">',
      '    <input class="chatbot-input" id="chatbotInput" type="text" placeholder="Escribe tu pregunta…" aria-label="Mensaje para el asistente" maxlength="500">',
      '    <button class="chatbot-send" type="submit" aria-label="Enviar mensaje">',
      '      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
      '    </button>',
      '  </form>',
      '</div>'
    ].join('');

    while (wrapper.firstChild) {
      document.body.appendChild(wrapper.firstChild);
    }
  }

  function addMessage(text, type) {
    var messages = document.getElementById('chatbotMessages');
    var div = document.createElement('div');
    div.className = 'chat-msg chat-msg--' + type;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function toggleChat() {
    var btn = document.getElementById('chatbotToggle');
    var win = document.getElementById('chatbotWindow');
    var isOpen = btn.classList.contains('is-open');

    if (isOpen) {
      btn.classList.remove('is-open');
      win.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      win.setAttribute('aria-hidden', 'true');
    } else {
      btn.classList.add('is-open');
      win.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      win.setAttribute('aria-hidden', 'false');
      if (history.length === 0) {
        addMessage('¡Hola! Soy el asistente de La Brasa de Cal Petit. ¿En qué puedo ayudarte?', 'bot');
      }
      setTimeout(function () {
        document.getElementById('chatbotInput').focus();
      }, 320);
    }
  }

  function sendMessage(text) {
    var input   = document.getElementById('chatbotInput');
    var sendBtn = document.querySelector('.chatbot-send');

    addMessage(text, 'user');
    history.push({ role: 'user', content: text });

    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    var typingEl = addMessage('Escribiendo…', 'typing');

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.slice(0, -1) })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        typingEl.remove();
        if (data.reply) {
          addMessage(data.reply, 'bot');
          history.push({ role: 'assistant', content: data.reply });
        } else {
          addMessage('Lo siento, no he podido procesar tu mensaje. Por favor, inténtalo de nuevo.', 'error');
        }
      })
      .catch(function () {
        typingEl.remove();
        addMessage('Error de conexión. Por favor, comprueba tu conexión e inténtalo de nuevo.', 'error');
      })
      .finally(function () {
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
      });
  }

  function init() {
    buildWidget();

    document.getElementById('chatbotToggle').addEventListener('click', toggleChat);

    document.getElementById('chatbotForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var text = document.getElementById('chatbotInput').value.trim();
      if (text) sendMessage(text);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
