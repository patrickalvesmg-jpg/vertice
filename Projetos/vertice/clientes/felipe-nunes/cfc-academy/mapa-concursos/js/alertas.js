import { montarHeader } from './header.js';
import { carregarConcursos } from './data.js';
import { renderCard } from './render.js';
import { store } from './store.js';
import { diasAte } from './calendario.js';

montarHeader('alertas');

function badgePrazo(c) {
  if (!c.dataProva) return '';
  const dd = diasAte(c.dataProva);
  return (dd >= 0 && dd <= 7) ? `<span class="badge-prazo">Em ${dd}d</span>` : '';
}

function aplicar(lista) {
  const alertas = store.getAlertas();
  const acompanhados = lista
    .filter(c => alertas.includes(c.id))
    .sort((a, b) => diasAte(a.dataProva) - diasAte(b.dataProva));

  const alvo = document.querySelector('#lista');
  if (!acompanhados.length) {
    alvo.innerHTML = '<p class="vazio">Você não está acompanhando nenhum prazo.</p>';
    return;
  }
  alvo.innerHTML = acompanhados.map(c => {
    const card = renderCard(c);
    const badge = badgePrazo(c);
    // insere o badge de prazo ao lado do badge de status existente no card
    return badge ? card.replace('</div>', `${badge}</div>`) : card;
  }).join('');

  alvo.querySelectorAll('[data-fav]').forEach(b =>
    b.addEventListener('click', () => { store.toggleFavorito(b.dataset.fav); aplicar(lista); }));
}

carregarConcursos()
  .then(lista => aplicar(lista))
  .catch(() => {
    document.querySelector('#lista').innerHTML = '<p class="vazio">Não foi possível carregar os concursos.</p>';
  });
