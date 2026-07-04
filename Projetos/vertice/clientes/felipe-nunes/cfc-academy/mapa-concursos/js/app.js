import { montarHeader } from './header.js';
import { carregarConcursos, contarPorStatus, filtrar, ordenar } from './data.js';
import { renderCard } from './render.js';
import { store } from './store.js';
import { montarMapa } from './mapa.js';

montarHeader('app');
let todos = [];
const estado = { texto:'', uf:'', status:'', ordem:'recentes' };

function aplicar(){
  let lista = filtrar(todos, estado);
  lista = ordenar(lista, estado.ordem);
  document.querySelector('#contador').textContent = `${lista.length} concursos`;
  const alvo = document.querySelector('#lista');
  alvo.innerHTML = lista.length
    ? lista.map(renderCard).join('')
    : '<p class="vazio">Nenhum concurso encontrado — ajuste os filtros.</p>';
  alvo.querySelectorAll('[data-fav]').forEach(b =>
    b.addEventListener('click', () => { store.toggleFavorito(b.dataset.fav); aplicar(); }));
}
function montarAbas(){
  const c = contarPorStatus(todos);
  const abas = [['','Todos',c.todos],['aberto','Abertas',c.aberto],['encerrado','Encerradas',c.encerrado],['outro','Outros',c.outro]];
  document.querySelector('#abas').innerHTML = abas.map(([v,l,n]) =>
    `<button class="aba ${estado.status===v?'aba-on':''}" data-status="${v}">${l} (${n})</button>`).join('');
  document.querySelectorAll('[data-status]').forEach(b =>
    b.addEventListener('click', () => { estado.status=b.dataset.status; montarAbas(); aplicar(); }));
}
window.__setUF = (uf) => { estado.uf = (estado.uf===uf ? '' : uf); aplicar(); };

document.querySelector('#busca').addEventListener('input', e => { estado.texto=e.target.value; aplicar(); });
document.querySelector('#ordenar').addEventListener('change', e => { estado.ordem=e.target.value; aplicar(); });

carregarConcursos()
  .then(d => {
    todos = d;
    montarAbas();
    aplicar();
    montarMapa(document.querySelector('#coluna-mapa'), todos, (uf) => window.__setUF(uf));
  })
  .catch(() => { document.querySelector('#lista').innerHTML = '<p class="vazio">Não foi possível carregar os concursos.</p>'; });
