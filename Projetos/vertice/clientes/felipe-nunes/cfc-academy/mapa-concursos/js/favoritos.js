import { montarHeader } from './header.js';
import { carregarConcursos } from './data.js';
import { renderCard } from './render.js';
import { store } from './store.js';

montarHeader('favoritos');

const vazio = `<div class="vazio">
  <h3>Você ainda não favoritou nenhum concurso</h3>
  <p>Salve os concursos que interessam para acompanhá-los aqui.</p>
  <a class="btn btn-primary" href="app.html">Explorar concursos ›</a>
</div>`;

function aplicar(lista) {
  const favoritos = store.getFavoritos();
  const filtrados = lista.filter(c => favoritos.includes(c.id));
  const alvo = document.querySelector('#lista');
  if (!filtrados.length){ alvo.innerHTML = vazio; return; }
  alvo.innerHTML = filtrados.map(renderCard).join('');
  alvo.querySelectorAll('[data-fav]').forEach(b =>
    b.addEventListener('click', () => { store.toggleFavorito(b.dataset.fav); aplicar(lista); }));
}

carregarConcursos()
  .then(aplicar)
  .catch(() => {
    document.querySelector('#lista').innerHTML = '<div class="vazio"><h3>Não foi possível carregar os concursos</h3></div>';
  });
