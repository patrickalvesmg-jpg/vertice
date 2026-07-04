import { montarHeader } from './header.js';
import { carregarConcursos, contarPorStatus, filtrar, ordenar,
         opcoesDe, contarFiltrosAtivos } from './data.js';
import { renderCard } from './render.js';
import { store } from './store.js';
import { montarMapa } from './mapa.js';

montarHeader('app');

let todos = [];
const estado = {
  texto:'', uf:'', status:'', ordem:'salario',
  bancas:[], niveis:[], escolaridades:[], cargos:[], salarioMin:0, soAbertas:false,
};

const $ = s => document.querySelector(s);
const nivelLabel = { federal:'Federal', estadual:'Estadual', municipal:'Municipal', distrital:'Distrital' };

/* ---------- render principal ---------- */
function aplicar(){
  let lista = filtrar(todos, estado);
  lista = ordenar(lista, estado.ordem);

  $('#contador-n').textContent = String(lista.length).padStart(2,'0');
  $('#contador-l').textContent = lista.length === 1 ? 'concurso' : 'concursos';

  const alvo = $('#lista');
  if (lista.length){
    alvo.innerHTML = lista.map(renderCard).join('');
    alvo.querySelectorAll('[data-fav]').forEach(b =>
      b.addEventListener('click', () => { store.toggleFavorito(b.dataset.fav); aplicar(); }));
  } else {
    alvo.innerHTML = `<div class="vazio">
      <h3>Nenhum concurso encontrado</h3>
      <p>Tente afrouxar os filtros ou limpar a busca.</p>
      <button class="btn btn-outline" id="vazio-limpar">Limpar filtros</button>
    </div>`;
    const b = $('#vazio-limpar'); if (b) b.addEventListener('click', limparTudo);
  }
  renderChipsAtivos();
}

/* ---------- abas de status ---------- */
function montarAbas(){
  const c = contarPorStatus(todos);
  const abas = [['','Todos',c.todos],['aberto','Abertas',c.aberto],
                ['encerrado','Encerradas',c.encerrado],['outro','Outros',c.outro]];
  $('#abas').innerHTML = abas.map(([v,l,n]) =>
    `<button class="aba ${estado.status===v?'aba-on':''}" data-status="${v}">${l} <span class="c">${n}</span></button>`).join('');
  $('#abas').querySelectorAll('[data-status]').forEach(b =>
    b.addEventListener('click', () => { estado.status = b.dataset.status; montarAbas(); aplicar(); }));
}

/* ---------- painel de filtros avançados (montado a partir dos dados) ---------- */
function montarPainelFiltros(){
  const bancas = opcoesDe(todos, 'banca');
  const niveis = opcoesDe(todos, 'nivel');
  const cargosFamilia = ['Contador','Auditor','Analista','Fiscal'];
  const maxSal = Math.max(...todos.map(c => c.salario || 0));

  const chips = (label, campo, opcoes, rotulo=x=>x) => `
    <div class="filtro-grupo">
      <label>${label}</label>
      <div class="filtro-chips" data-grupo="${campo}">
        ${opcoes.map(o => `<span class="filtro-chip" data-val="${o}">${rotulo(o)}</span>`).join('')}
      </div>
    </div>`;

  $('#filtros-adv').innerHTML = `
    ${chips('Banca','bancas',bancas)}
    ${chips('Nível do órgão','niveis',niveis,n=>nivelLabel[n]||n)}
    ${chips('Cargo','cargos',cargosFamilia)}
    <div class="filtro-grupo">
      <label>Salário mínimo</label>
      <div class="filtro-range">
        <span>R$0</span>
        <input type="range" id="f-salario" min="0" max="${Math.ceil(maxSal/1000)*1000}" step="500" value="0">
        <span id="f-salario-val">Qualquer</span>
      </div>
    </div>
    ${chips('Escolaridade','escolaridades',opcoesDe(todos,'escolaridade'),e=>e==='superior'?'Superior':'Médio')}
    <div class="filtro-grupo">
      <label>Situação</label>
      <div class="filtro-chips" data-grupo="soAbertas">
        <span class="filtro-chip" data-val="1">Só inscrições abertas</span>
      </div>
    </div>
    <div class="filtros-foot">
      <button class="filtros-limpar" id="filtros-limpar">✕ Limpar filtros</button>
      <button class="btn btn-primary" id="filtros-fechar">Ver resultados</button>
    </div>`;

  // chips de array (bancas/niveis/cargos/escolaridades)
  $('#filtros-adv').querySelectorAll('.filtro-chips[data-grupo]').forEach(grp => {
    const campo = grp.dataset.grupo;
    grp.querySelectorAll('.filtro-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.dataset.val;
        if (campo === 'soAbertas'){
          estado.soAbertas = !estado.soAbertas;
          chip.classList.toggle('on', estado.soAbertas);
        } else {
          const arr = estado[campo];
          const i = arr.indexOf(val);
          if (i === -1) arr.push(val); else arr.splice(i,1);
          chip.classList.toggle('on', i === -1);
        }
        aplicar();
      });
    });
  });
  // slider de salário
  const sal = $('#f-salario'), salVal = $('#f-salario-val');
  sal.addEventListener('input', () => {
    estado.salarioMin = +sal.value;
    salVal.textContent = sal.value === '0' ? 'Qualquer' : 'R$ ' + (+sal.value).toLocaleString('pt-BR');
    aplicar();
  });
  $('#filtros-limpar').addEventListener('click', limparTudo);
  $('#filtros-fechar').addEventListener('click', () => { $('#filtros-adv').hidden = true; });
}

/* ---------- chips de filtro ativo (acima da lista) ---------- */
function renderChipsAtivos(){
  const chips = [];
  const add = (label, ondelete) => chips.push({ label, ondelete });
  if (estado.uf) add(estado.uf, () => { estado.uf=''; });
  estado.bancas.forEach(b => add(`Banca ${b}`, () => estado.bancas = estado.bancas.filter(x=>x!==b)));
  estado.niveis.forEach(n => add(`Nível ${nivelLabel[n]||n}`, () => estado.niveis = estado.niveis.filter(x=>x!==n)));
  estado.cargos.forEach(c => add(`Cargo ${c}`, () => estado.cargos = estado.cargos.filter(x=>x!==c)));
  estado.escolaridades.forEach(e => add(e==='superior'?'Superior':'Médio', () => estado.escolaridades = estado.escolaridades.filter(x=>x!==e)));
  if (estado.salarioMin) add(`≥ R$ ${estado.salarioMin.toLocaleString('pt-BR')}`, () => estado.salarioMin = 0);
  if (estado.soAbertas) add('Só abertas', () => estado.soAbertas = false);

  const box = $('#filtros-ativos');
  box.innerHTML = chips.map((c,i) =>
    `<span class="fchip"><b>${c.label}</b> <span class="x" data-chip="${i}">✕</span></span>`).join('');
  box.querySelectorAll('[data-chip]').forEach(x =>
    x.addEventListener('click', () => { chips[+x.dataset.chip].ondelete(); sincronizarPainel(); aplicar(); }));

  // rótulo do botão de filtros com contagem
  const n = contarFiltrosAtivos(estado);
  $('#btn-filtros').textContent = n ? `⚙ Filtros avançados · ${n}` : '⚙ Filtros avançados';
}

/* reflete o estado atual nas marcações on/off do painel (após remover um chip) */
function sincronizarPainel(){
  const adv = $('#filtros-adv');
  if (!adv || adv.hidden) return;
  adv.querySelectorAll('.filtro-chips[data-grupo]').forEach(grp => {
    const campo = grp.dataset.grupo;
    grp.querySelectorAll('.filtro-chip').forEach(chip => {
      const val = chip.dataset.val;
      const on = campo === 'soAbertas' ? estado.soAbertas : estado[campo].includes(val);
      chip.classList.toggle('on', on);
    });
  });
  const sal = $('#f-salario');
  if (sal){ sal.value = estado.salarioMin; $('#f-salario-val').textContent = estado.salarioMin ? 'R$ '+estado.salarioMin.toLocaleString('pt-BR') : 'Qualquer'; }
}

function limparTudo(){
  estado.uf=''; estado.bancas=[]; estado.niveis=[]; estado.escolaridades=[];
  estado.cargos=[]; estado.salarioMin=0; estado.soAbertas=false;
  sincronizarPainel();
  aplicar();
}

/* mapa empurra o filtro de UF */
window.__setUF = (uf) => { estado.uf = (estado.uf===uf ? '' : uf); aplicar(); };

/* ---------- listeners fixos ---------- */
$('#busca').addEventListener('input', e => { estado.texto = e.target.value; aplicar(); });
$('#ordenar').addEventListener('change', e => { estado.ordem = e.target.value; aplicar(); });
$('#btn-filtros').addEventListener('click', () => {
  const adv = $('#filtros-adv');
  adv.hidden = !adv.hidden;
  if (!adv.hidden) sincronizarPainel();
});

/* ---------- boot ---------- */
carregarConcursos()
  .then(d => {
    todos = d;
    montarAbas();
    montarPainelFiltros();
    aplicar();
    montarMapa($('#coluna-mapa'), todos, (uf) => window.__setUF(uf));
    // permite abrir o painel de filtros direto via #filtros (deep-link)
    if (location.hash === '#filtros'){ $('#filtros-adv').hidden = false; sincronizarPainel(); }
  })
  .catch(() => {
    $('#lista').innerHTML = '<div class="vazio"><h3>Não foi possível carregar os concursos</h3><p>Tente recarregar a página.</p></div>';
  });
