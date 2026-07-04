import { montarHeader } from './header.js';
import { carregarConcursos } from './data.js';
import { renderCard, diasAte } from './render.js';
import { store } from './store.js';

montarHeader('alertas');

const vazio = `<div class="vazio">
  <h3>Você não está acompanhando nenhum prazo</h3>
  <p>Toque em “Acompanhar prazo” num concurso para ser lembrado por aqui.</p>
  <a class="btn btn-primary" href="app.html">Explorar concursos ›</a>
</div>`;

function aplicar(lista) {
  const alertas = store.getAlertas();
  // ordena por proximidade da prova (mais próxima primeiro)
  const acompanhados = lista
    .filter(c => alertas.includes(c.id))
    .sort((a, b) => (diasAte(a.dataProva) ?? 1e9) - (diasAte(b.dataProva) ?? 1e9));

  const alvo = document.querySelector('#lista');
  if (!acompanhados.length){ alvo.innerHTML = vazio; return; }
  // renderCard já mostra o prazo contextual; nada de hack de string aqui.
  alvo.innerHTML = acompanhados.map(renderCard).join('');
  alvo.querySelectorAll('[data-fav]').forEach(b =>
    b.addEventListener('click', () => { store.toggleFavorito(b.dataset.fav); aplicar(lista); }));
}

carregarConcursos()
  .then(aplicar)
  .catch(() => {
    document.querySelector('#lista').innerHTML = '<div class="vazio"><h3>Não foi possível carregar os concursos</h3></div>';
  });
