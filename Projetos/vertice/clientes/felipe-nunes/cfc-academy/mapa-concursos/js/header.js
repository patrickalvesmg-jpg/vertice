import { store } from './store.js';
export function montarHeader(ativo = ''){
  if (!store.isLogged()) { location.href = 'login.html'; return; }
  const cls = (...xs) => xs.filter(Boolean).join(' ');
  const item = (href, label, id, extra='') =>
    `<a href="${href}" class="${cls('hd-link', extra, ativo===id && 'ativo')}">${label}</a>`;
  const html = `
  <header class="hd">
    <div class="hd-in">
      <a href="app.html" class="hd-logo">Mapa de Concursos<span>.</span></a>
      <nav class="hd-nav">
        ${item('app.html','Concursos','app')}
        ${item('calendario.html','Calendário','calendario')}
        ${item('favoritos.html','Favoritos','favoritos')}
        ${item('alertas.html','Alertas','alertas','hd-alertas')}
        ${item('perfil.html','Meu Perfil','perfil')}
        <a href="#" class="hd-link hd-grupo">Comunidade ›</a>
        <a href="#" class="hd-link hd-sair" id="hd-sair">Sair</a>
      </nav>
    </div>
  </header>`;
  document.body.insertAdjacentHTML('afterbegin', html);
  document.querySelector('#hd-sair').addEventListener('click', (e) => {
    e.preventDefault(); store.logout(); location.href = 'index.html';
  });
}
