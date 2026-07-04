import { store } from './store.js';
export function montarHeader(ativo = ''){
  if (!store.isLogged()) { location.href = 'login.html'; return; }
  const item = (href, label, id, cls='') =>
    `<a href="${href}" class="hd-link ${cls} ${ativo===id?'ativo':''}">${label}</a>`;
  const html = `
  <header class="hd">
    <div class="container hd-in">
      <a href="app.html" class="hd-logo">CFC · Mapa de Concursos</a>
      <nav class="hd-nav">
        ${item('calendario.html','📅 Calendário','calendario')}
        ${item('perfil.html','👤 Meu Perfil','perfil')}
        ${item('alertas.html','🔔 Alertas','alertas','hd-alertas')}
        <a href="#" class="hd-link hd-grupo">🟢 Grupo</a>
        <a href="#" class="hd-link hd-sair" id="hd-sair">↪ Sair</a>
      </nav>
    </div>
  </header>`;
  document.body.insertAdjacentHTML('afterbegin', html);
  document.querySelector('#hd-sair').addEventListener('click', (e) => {
    e.preventDefault(); store.logout(); location.href = 'index.html';
  });
}
