import $ from 'jquery';
import { initRouter } from './router.js';
import '../css/global/main.css';
import '../css/global/spacing.css';
import '../css/global/mobile.css';

$(document).ready(async () => {
  $('.overlay-sidebar').each(function() {
    const $overlay = $(this);
    $overlay.addClass('hidden').css({
      'display': 'none',
      'visibility': 'hidden',
      'opacity': '0',
      'pointer-events': 'none',
      'z-index': '-1'
    });
  });

  try {
    const router = initRouter();
    window.router = router;

    $.ajaxSetup({
      xhrFields: {
        withCredentials: true
      }
    });
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="error-container">
          <h2>Erro ao inicializar aplicação</h2>
          <p>${error.message}</p>
          <button onclick="location.reload()">Recarregar página</button>
        </div>
      `;
    }
  }
});

