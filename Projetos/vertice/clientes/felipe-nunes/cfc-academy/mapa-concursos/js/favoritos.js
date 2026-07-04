import { montarHeader } from './header.js';
import { carregarConcursos } from './data.js';
import { renderCard } from './render.js';
import { store } from './store.js';

montarHeader();

function aplicar(lista) {
  const favoritos = store.getFavoritos();
  const filtrados = lista.filter(c => favoritos.includes(c.id));
  const alvo = document.querySelector('#lista');
  alvo.innerHTML = filtrados.length
    ? filtrados.map(renderCard).join('')
    : '<p class="vazio">Você ainda não favoritou nenhum concurso.</p>';
  alvo.querySelectorAll('[data-fav]').forEach(b =>
    b.addEventListener('click', () => { store.toggleFavorito(b.dataset.fav); aplicar(lista); }));
}

carregarConcursos()
  .then(lista => aplicar(lista))
  .catch(() => {
    document.querySelector('#lista').innerHTML = '<p class="vazio">Não foi possível carregar os concursos.</p>';
  });
