# Mapa de Concursos CFC — Plano de Implementação (fase front)

> **Para workers agênticos:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar tarefa a tarefa. Os passos usam checkbox (`- [ ]`) para rastreio.

**Goal:** Construir a interface navegável de uma plataforma-mapa de concursos contábeis para a CFC Academy, fiel aos prints da referência, com dados de exemplo (sem backend).

**Architecture:** Site estático (HTML/CSS/JS puro, sem build). Dados em `data/concursos.json`. Estado do usuário (sessão simulada, favoritos, alertas) em `localStorage`. Módulos JS com responsabilidade única (`store`, `data`, `header`, `mapa`, `calendario`, `app`). Publicável em GitHub Pages.

**Tech Stack:** HTML5, CSS3 (variáveis CSS), JavaScript ES6 (módulos via `<script type="module">`), SVG inline para o mapa. Nenhuma dependência externa.

## Global Constraints

- **Sem frameworks, sem build system, sem dependências externas** — só HTML/CSS/JS puro (padrão do repositório).
- **Pasta raiz do projeto:** `Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/`. Todos os caminhos abaixo são relativos a ela salvo indicação contrária.
- **Paleta:** azul-marinho CFC como primária, laranja como destaque/CTA, verde para WhatsApp. Definida só em `css/variables.css` (ponto único de calibração).
- **Idioma:** todo texto de UI em português do Brasil.
- **Status válidos:** `aberto`, `encerrado`, `outro` (mapeados às abas Abertas / Encerradas / Outros).
- **Estado do usuário só via `store.js`** — nenhum outro arquivo acessa `localStorage` diretamente.
- **Botão "Grupo" (WhatsApp)** aponta para `#` nesta fase (placeholder).
- **Verificação:** cada tarefa é verificada abrindo a página no navegador via um servidor estático local (`python -m http.server` na pasta do projeto) e conferindo o comportamento descrito. Funções puras de JS têm um teste em `test/test.html` que roda asserts no console.

---

### Task 1: Scaffold + identidade visual + dados de exemplo

**Files:**
- Create: `css/variables.css`
- Create: `css/style.css`
- Create: `data/concursos.json`
- Create: `index.html` (placeholder mínimo para validar o CSS carregando)

**Interfaces:**
- Produces: variáveis CSS (`--cor-primaria`, `--cor-destaque`, `--cor-whatsapp`, `--cor-fundo`, `--cor-texto`, `--cor-borda`, `--raio`, `--sombra`); estrutura de `concursos.json` (array de objetos com os campos do spec).

- [ ] **Step 1: Criar `css/variables.css`** com a paleta CFC.

```css
:root {
  --cor-primaria: #0f2a4a;      /* azul-marinho CFC (calibrar com logo) */
  --cor-primaria-clara: #1c3d63;
  --cor-destaque: #f39422;      /* laranja CTA/alertas */
  --cor-whatsapp: #25a05a;
  --cor-fundo: #f2f3f5;
  --cor-card: #ffffff;
  --cor-texto: #1f2937;
  --cor-texto-suave: #6b7280;
  --cor-borda: #e5e7eb;
  --raio: 10px;
  --sombra: 0 1px 3px rgba(0,0,0,.08);
  --fonte: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
```

- [ ] **Step 2: Criar `css/style.css`** com reset básico e classes utilitárias (container, header, botões, card). Conteúdo inicial mínimo:

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--fonte); background: var(--cor-fundo); color: var(--cor-texto); }
.container { max-width: 1280px; margin: 0 auto; padding: 0 20px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: var(--raio); border: none; cursor: pointer; font-size: 14px; text-decoration: none; }
.btn-primary { background: var(--cor-primaria); color: #fff; }
.btn-destaque { background: var(--cor-destaque); color: #fff; }
.btn-whatsapp { background: var(--cor-whatsapp); color: #fff; }
.card { background: var(--cor-card); border-radius: var(--raio); box-shadow: var(--sombra); padding: 20px; }
```

- [ ] **Step 3: Criar `data/concursos.json`** com **8–10 concursos de exemplo** cobrindo: pelo menos 2 `aberto`, 2 `encerrado`, 1 `outro`; UFs variadas (MG, PR, SP, PE, BA, RS) para o mapa; casos "1 + CR" em vagas e "+ benefícios" em salário. Cada objeto segue o modelo do spec:

```json
[
  {
    "id": "conc-barra-minas-2026",
    "orgao": "Prefeitura de Conceição da Barra de Minas/MG",
    "cargo": "Contador",
    "banca": "JCM Concursos",
    "uf": "MG",
    "cidade": "Conceição da Barra de Minas",
    "vagas": "1",
    "salario": 4856.66,
    "salarioObs": "",
    "cargaHoraria": "40h",
    "status": "aberto",
    "inscricaoInicio": "2026-08-19T08:00",
    "inscricaoFim": "2026-09-18T16:00",
    "dataProva": "2026-10-17",
    "localProva": "Conceição da Barra de Minas/MG",
    "atualizadoEm": "2026-06-21",
    "editalUrl": "https://example.gov.br/edital1.pdf"
  }
]
```
(Completar com os demais itens no mesmo formato.)

- [ ] **Step 4: Criar `index.html` placeholder** que só carrega o CSS e mostra um `<h1>` para confirmar que as variáveis/fonte aplicam.

```html
<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="css/variables.css"><link rel="stylesheet" href="css/style.css">
<title>Mapa de Concursos CFC</title></head>
<body><div class="container"><h1 style="color:var(--cor-primaria)">Mapa de Concursos CFC</h1></div></body></html>
```

- [ ] **Step 5: Verificar no navegador.** Rodar na pasta do projeto: `python -m http.server 8000`. Abrir `http://localhost:8000/`. Esperado: título em azul-marinho, fundo cinza-claro.

- [ ] **Step 6: Validar o JSON.** Rodar: `python -c "import json;print(len(json.load(open('data/concursos.json'))),'concursos ok')"`. Esperado: imprime a contagem sem erro de parse.

- [ ] **Step 7: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/
git commit -m "feat(cfc/mapa): scaffold, paleta CFC e dados de exemplo"
```

---

### Task 2: Módulo `store.js` (sessão, favoritos, alertas) + testes

**Files:**
- Create: `js/store.js`
- Create: `test/test.html`

**Interfaces:**
- Produces: `store` (objeto exportado) com `login(email)`, `logout()`, `isLogged()`, `getUsuario()`, `toggleFavorito(id)`, `getFavoritos()` (array de ids), `isFavorito(id)`, `toggleAlerta(id)`, `getAlertas()` (array de ids), `isAlerta(id)`.

- [ ] **Step 1: Escrever `test/test.html`** com asserts no console para o store (o teste falha porque `store.js` ainda não existe).

```html
<!doctype html><meta charset="utf-8"><title>Testes</title>
<script type="module">
import { store } from '../js/store.js';
function assert(cond, msg){ console[cond?'log':'error']((cond?'PASS':'FAIL')+': '+msg); }
localStorage.clear();
assert(store.isLogged() === false, 'começa deslogado');
store.login('a@b.com');
assert(store.isLogged() === true, 'loga');
assert(store.getUsuario().email === 'a@b.com', 'guarda email');
store.toggleFavorito('x1');
assert(store.isFavorito('x1') === true, 'favorita');
store.toggleFavorito('x1');
assert(store.isFavorito('x1') === false, 'desfavorita');
store.toggleAlerta('x2');
assert(store.getAlertas().includes('x2'), 'cria alerta');
store.logout();
assert(store.isLogged() === false, 'desloga');
console.log('--- fim dos testes ---');
</script>
```

- [ ] **Step 2: Abrir `test/test.html` no navegador** (via http.server) e confirmar no console que aparece **FAIL** (módulo inexistente / erro de import).

- [ ] **Step 3: Implementar `js/store.js`.**

```js
const K = { user: 'cfc_user', fav: 'cfc_fav', alerta: 'cfc_alerta' };
const readArr = k => JSON.parse(localStorage.getItem(k) || '[]');
const writeArr = (k, a) => localStorage.setItem(k, JSON.stringify(a));
const toggle = (k, id) => {
  const a = readArr(k); const i = a.indexOf(id);
  if (i === -1) a.push(id); else a.splice(i, 1);
  writeArr(k, a); return a;
};
export const store = {
  login(email){ localStorage.setItem(K.user, JSON.stringify({ email })); },
  logout(){ localStorage.removeItem(K.user); },
  isLogged(){ return !!localStorage.getItem(K.user); },
  getUsuario(){ return JSON.parse(localStorage.getItem(K.user) || 'null'); },
  toggleFavorito(id){ return toggle(K.fav, id); },
  getFavoritos(){ return readArr(K.fav); },
  isFavorito(id){ return readArr(K.fav).includes(id); },
  toggleAlerta(id){ return toggle(K.alerta, id); },
  getAlertas(){ return readArr(K.alerta); },
  isAlerta(id){ return readArr(K.alerta).includes(id); },
};
```

- [ ] **Step 4: Recarregar `test/test.html`** e confirmar que **todos os asserts imprimem PASS**.

- [ ] **Step 5: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/store.js Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/test/test.html
git commit -m "feat(cfc/mapa): store.js (sessão, favoritos, alertas) + testes"
```

---

### Task 3: Módulo `data.js` (carregar concursos + contagens) + testes

**Files:**
- Create: `js/data.js`
- Modify: `test/test.html` (acrescentar asserts do data)

**Interfaces:**
- Consumes: `data/concursos.json`.
- Produces: `carregarConcursos()` → `Promise<Array>`; `contarPorUF(lista)` → `{ MG: 3, ... }`; `contarPorStatus(lista)` → `{ todos, aberto, encerrado, outro }`; `filtrar(lista, { texto, uf, status })` → `Array`; `ordenar(lista, criterio)` → `Array` (criterio `'recentes'` usa `atualizadoEm` desc).

- [ ] **Step 1: Adicionar asserts em `test/test.html`** usando uma lista fixa (não depende do fetch):

```js
import { contarPorUF, contarPorStatus, filtrar, ordenar } from '../js/data.js';
const amostra = [
  { id:'a', uf:'MG', status:'aberto', orgao:'Prefeitura X', cargo:'Contador', banca:'FCC', atualizadoEm:'2026-06-01' },
  { id:'b', uf:'MG', status:'encerrado', orgao:'Câmara Y', cargo:'Contador', banca:'Cebraspe', atualizadoEm:'2026-06-10' },
  { id:'c', uf:'SP', status:'aberto', orgao:'TRF', cargo:'Analista', banca:'FCC', atualizadoEm:'2026-05-01' },
];
assert(contarPorUF(amostra).MG === 2, 'conta 2 em MG');
assert(contarPorStatus(amostra).aberto === 2, 'conta 2 abertos');
assert(filtrar(amostra, { uf:'SP' }).length === 1, 'filtra por UF');
assert(filtrar(amostra, { texto:'trf' }).length === 1, 'busca por texto');
assert(filtrar(amostra, { status:'encerrado' }).length === 1, 'filtra por status');
assert(ordenar(amostra, 'recentes')[0].id === 'b', 'ordena por mais recente');
```

- [ ] **Step 2: Abrir `test/test.html`** e confirmar **FAIL** (data.js inexistente).

- [ ] **Step 3: Implementar `js/data.js`.**

```js
export async function carregarConcursos(){
  const r = await fetch('data/concursos.json');
  if (!r.ok) throw new Error('falha ao carregar concursos');
  return r.json();
}
export function contarPorUF(lista){
  return lista.reduce((acc, c) => { acc[c.uf] = (acc[c.uf]||0)+1; return acc; }, {});
}
export function contarPorStatus(lista){
  const base = { todos: lista.length, aberto:0, encerrado:0, outro:0 };
  return lista.reduce((acc, c) => { acc[c.status] = (acc[c.status]||0)+1; return acc; }, base);
}
export function filtrar(lista, { texto='', uf='', status='' } = {}){
  const t = texto.trim().toLowerCase();
  return lista.filter(c => {
    if (uf && c.uf !== uf) return false;
    if (status && c.status !== status) return false;
    if (t && !`${c.orgao} ${c.cargo} ${c.banca}`.toLowerCase().includes(t)) return false;
    return true;
  });
}
export function ordenar(lista, criterio='recentes'){
  const copia = [...lista];
  if (criterio === 'recentes') copia.sort((a,b) => (b.atualizadoEm||'').localeCompare(a.atualizadoEm||''));
  return copia;
}
```

- [ ] **Step 4: Recarregar `test/test.html`** e confirmar todos **PASS**.

- [ ] **Step 5: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/data.js Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/test/test.html
git commit -m "feat(cfc/mapa): data.js (carga, contagens, filtro, ordenação) + testes"
```

---

### Task 4: Landing pública + Login/Cadastro

**Files:**
- Modify: `index.html` (substituir placeholder pela landing real)
- Create: `login.html`
- Create: `js/login.js`

**Interfaces:**
- Consumes: `store.login`, `store.isLogged` (de `js/store.js`).
- Produces: fluxo — login simulado grava sessão e redireciona para `app.html`.

- [ ] **Step 1: Escrever `index.html`** (landing) fiel à referência: header com logo + botão "Entrar" (link para `login.html`); hero com headline "Mapa de Concursos Contábeis" e subtítulo; três cards de recurso (Concursos atualizados / Alertas de prazo / Favoritos na nuvem); link "Primeiro acesso? Toque aqui" → `login.html`; rodapé "© 2026 CFC Academy — Todos os direitos reservados". Usar classes de `style.css`.

- [ ] **Step 2: Escrever `login.html`** com formulário e-mail + senha, botão "Entrar", e um toggle de texto para "Criar conta" (mesmo form, muda só o rótulo). Carrega `js/login.js` como módulo.

- [ ] **Step 3: Implementar `js/login.js`.**

```js
import { store } from './store.js';
if (store.isLogged()) location.href = 'app.html';
document.querySelector('#form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value.trim();
  if (!email) return;
  store.login(email);
  location.href = 'app.html';
});
```

- [ ] **Step 4: Verificar no navegador.** Abrir `/index.html` → clicar "Entrar" → em `/login.html` digitar um e-mail → submeter. Esperado: redireciona para `app.html` (que ainda dá 404 ou branco — ok nesta tarefa). Reabrir `/login.html` já logado deve redirecionar direto para `app.html`.

- [ ] **Step 5: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/index.html Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/login.html Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/login.js
git commit -m "feat(cfc/mapa): landing pública + login/cadastro simulado"
```

---

### Task 5: Header comum da área logada (`header.js`)

**Files:**
- Create: `js/header.js`

**Interfaces:**
- Consumes: `store.isLogged`, `store.logout` (de `js/store.js`).
- Produces: `montarHeader(ativo)` — injeta o `<header>` no topo do `<body>`; se não logado, redireciona para `login.html`. `ativo` marca o item atual (`'app' | 'calendario' | 'perfil' | 'alertas'`).

- [ ] **Step 1: Implementar `js/header.js`.**

```js
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
```

- [ ] **Step 2: Adicionar estilos do header em `css/style.css`.**

```css
.hd { background: var(--cor-primaria); color:#fff; }
.hd-in { display:flex; align-items:center; justify-content:space-between; height:64px; }
.hd-logo { color:#fff; font-weight:700; text-decoration:none; }
.hd-nav { display:flex; align-items:center; gap:18px; }
.hd-link { color:#e5eefb; text-decoration:none; font-size:14px; }
.hd-link.ativo { color:#fff; font-weight:600; }
.hd-alertas { background:var(--cor-destaque); color:#fff; padding:8px 14px; border-radius:var(--raio); }
.hd-grupo { background:var(--cor-whatsapp); color:#fff; padding:8px 14px; border-radius:var(--raio); }
```

- [ ] **Step 3: Verificar** criando um `app.html` temporário mínimo que importa e chama `montarHeader('app')`. Abrir logado → header aparece; deslogar (botão Sair) → vai para `index.html`; abrir `app.html` deslogado → redireciona para `login.html`. (O `app.html` real vem na Task 6; aqui basta um stub para validar.)

- [ ] **Step 4: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/header.js Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/css/style.css
git commit -m "feat(cfc/mapa): header comum da área logada"
```

---

### Task 6: Tela principal — lista de cards + busca + abas + ordenação (`app.html` + `app.js`)

**Files:**
- Create/replace: `app.html`
- Create: `js/app.js`
- Create: `js/render.js`

**Interfaces:**
- Consumes: `carregarConcursos, contarPorStatus, filtrar, ordenar` (data.js); `store` (favoritos); `montarHeader` (header.js).
- Produces: `renderCard(concurso)` → string HTML (em `render.js`, reutilizada em favoritos/alertas); estado da tela reage a busca/aba/ordenação. Expõe `window.__setUF(uf)` para o mapa (Task 7) empurrar o filtro de estado.

- [ ] **Step 1: Implementar `js/render.js`** com a função de card fiel ao print.

```js
import { store } from './store.js';
const brl = v => v==null ? '' : v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const dia = s => s ? new Date(s).toLocaleDateString('pt-BR') : '';
export function renderCard(c){
  const aberto = c.status === 'aberto';
  const badge = aberto ? '<span class="badge badge-aberto">Inscrições Abertas</span>'
    : c.status==='encerrado' ? '<span class="badge badge-enc">Inscrições Encerradas</span>'
    : '<span class="badge">Outros</span>';
  const fav = store.isFavorito(c.id) ? 'fav-on' : '';
  return `<article class="conc ${aberto?'conc-aberto':''}">
    <div class="conc-top"><h3>${c.orgao}</h3>${badge}</div>
    <p class="conc-cargo">${c.cargo}</p>
    <p class="conc-linha">💲 ${brl(c.salario)}${c.salarioObs?' '+c.salarioObs:''} · 📅 Prova: ${dia(c.dataProva)}</p>
    <p class="conc-meta">📍 ${c.cidade||''}/${c.uf} · Vagas: ${c.vagas} · Banca: ${c.banca} · ${c.cargaHoraria||''}</p>
    <p class="conc-meta">🗓️ Inscrições: ${dia(c.inscricaoInicio)} a ${dia(c.inscricaoFim)}</p>
    ${c.localProva?`<p class="conc-meta"><b>Local da prova:</b> ${c.localProva}</p>`:''}
    <p class="conc-atual">Atualizado em: ${dia(c.atualizadoEm)}</p>
    <div class="conc-acoes">
      <button class="btn-fav ${fav}" data-fav="${c.id}">♥</button>
      <a class="btn btn-primary" href="${c.editalUrl}" target="_blank" rel="noopener">↗ Edital</a>
    </div>
  </article>`;
}
```

- [ ] **Step 2: Escrever `app.html`** com: `<div id="hd"></div>` (header injetado), layout 2 colunas (`#coluna-lista` e `#coluna-mapa`), contador `#contador`, dropdown de ordenação `#ordenar`, input de busca `#busca`, container de abas `#abas`, botão "Filtros avançados", e `#lista`. Carrega `js/app.js` como módulo. Deixar `#coluna-mapa` vazio (preenchido na Task 7).

- [ ] **Step 3: Implementar `js/app.js`.**

```js
import { montarHeader } from './header.js';
import { carregarConcursos, contarPorStatus, filtrar, ordenar } from './data.js';
import { renderCard } from './render.js';
import { store } from './store.js';

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
  .then(d => { todos = d; montarAbas(); aplicar(); })
  .catch(() => { document.querySelector('#lista').innerHTML = '<p class="vazio">Não foi possível carregar os concursos.</p>'; });
```

- [ ] **Step 4: Adicionar estilos** de card, badge, abas, botão favorito e layout 2 colunas em `css/style.css` (grid `#coluna-lista` 2fr / `#coluna-mapa` 1fr; empilha em telas estreitas via media query).

- [ ] **Step 5: Verificar no navegador** (logado): lista mostra os cards; contador bate; digitar na busca filtra; clicar nas abas troca e mantém contagem; mudar ordenação reordena; clicar no ♥ marca/desmarca (persiste ao recarregar). Estado vazio aparece com busca sem match.

- [ ] **Step 6: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/app.html Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/app.js Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/render.js Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/css/style.css
git commit -m "feat(cfc/mapa): tela principal — cards, busca, abas de status, ordenação"
```

---

### Task 7: Mapa do Brasil SVG interativo (`mapa.js` + `assets/brasil.svg`)

**Files:**
- Create: `assets/brasil.svg`
- Create: `js/mapa.js`
- Modify: `app.html` (referenciar `#coluna-mapa`), `js/app.js` (inicializar o mapa)

**Interfaces:**
- Consumes: `contarPorUF` (data.js); `window.__setUF` (app.js).
- Produces: `montarMapa(containerEl, lista, onSelecionar)` — injeta o SVG, pinta cada UF por contagem, adiciona rótulo de contagem, e chama `onSelecionar(uf)` no clique (toggle visual de selecionado).

- [ ] **Step 1: Obter `assets/brasil.svg`** — um SVG do mapa do Brasil em que **cada estado é um `<path>` com `id` igual à sigla da UF** (ex.: `id="SP"`). Usar um SVG livre de domínio público / CC0 dos estados brasileiros e salvar em `assets/brasil.svg`. Conferir que os 27 ids de UF existem.

- [ ] **Step 2: Implementar `js/mapa.js`.**

```js
import { contarPorUF } from './data.js';
export async function montarMapa(container, lista, onSelecionar){
  const svg = await (await fetch('assets/brasil.svg')).text();
  container.innerHTML = `<div class="mapa-head">Mapa do Brasil</div>
    <p class="mapa-sub">Clique em um estado para filtrar</p>
    <div class="mapa-svg">${svg}</div>
    <div class="mapa-legenda">
      <span><i class="lg lg-com"></i> Com concursos</span>
      <span><i class="lg lg-sel"></i> Selecionado</span>
      <span><i class="lg lg-sem"></i> Sem concursos</span>
    </div>`;
  const cont = contarPorUF(lista);
  let selecionado = '';
  const paths = container.querySelectorAll('.mapa-svg path');
  paths.forEach(p => {
    const uf = p.id; const n = cont[uf] || 0;
    p.classList.add(n ? 'uf-com' : 'uf-sem');
    p.addEventListener('click', () => {
      selecionado = (selecionado === uf ? '' : uf);
      paths.forEach(x => x.classList.toggle('uf-sel', x.id === selecionado && selecionado));
      onSelecionar(selecionado);
    });
    const t = p.getAttribute('data-uf-label');
    if (n && !t) p.setAttribute('data-uf-label', `${uf} (${n})`);
  });
}
```

- [ ] **Step 3: Inicializar o mapa em `js/app.js`** — após `carregarConcursos().then(...)`, chamar:

```js
import { montarMapa } from './mapa.js';
// dentro do .then(d => { ... }) após montarAbas()/aplicar():
montarMapa(document.querySelector('#coluna-mapa'), todos, (uf) => window.__setUF(uf));
```

- [ ] **Step 4: Estilizar o mapa em `css/style.css`** — `.uf-sem{fill:#d1d5db}` `.uf-com{fill:var(--cor-primaria);cursor:pointer}` `.uf-sel{fill:var(--cor-destaque)}`, hover mais claro, card do mapa, legenda com quadradinhos coloridos.

- [ ] **Step 5: Verificar no navegador:** o mapa aparece à direita; estados com concursos em azul, sem em cinza; clicar em SP filtra a lista para SP e o estado fica laranja; clicar de novo limpa o filtro e a cor. Contador e cards refletem o filtro.

- [ ] **Step 6: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/assets/brasil.svg Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/mapa.js Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/app.js Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/css/style.css
git commit -m "feat(cfc/mapa): mapa do Brasil SVG interativo (filtro por estado)"
```

---

### Task 8: Calendário de Provas (`calendario.html` + `calendario.js`)

**Files:**
- Create: `calendario.html`
- Create: `js/calendario.js`
- Modify: `test/test.html` (asserts de agrupamento por mês)

**Interfaces:**
- Consumes: `carregarConcursos` (data.js); `montarHeader` (header.js); `store.getAlertas` (para badge "Em Xd" via proximidade).
- Produces: `agruparPorMes(lista)` → `{ '2026-07': [concursos...], ... }` (chave AAAA-MM da `dataProva`); `diasAte(dataISO)` → número de dias a partir de hoje.

- [ ] **Step 1: Adicionar asserts em `test/test.html`** para `agruparPorMes` e `diasAte`:

```js
import { agruparPorMes } from '../js/calendario.js';
const provas = [{id:'a',dataProva:'2026-07-11'},{id:'b',dataProva:'2026-07-12'},{id:'c',dataProva:'2026-08-01'}];
const g = agruparPorMes(provas);
assert(g['2026-07'].length === 2, 'agrupa 2 provas em julho');
assert(g['2026-08'].length === 1, 'agrupa 1 prova em agosto');
```

- [ ] **Step 2: Abrir `test/test.html`** e confirmar **FAIL** (calendario.js inexistente).

- [ ] **Step 3: Implementar `js/calendario.js`** (funções puras + render).

```js
export function agruparPorMes(lista){
  return lista.filter(c=>c.dataProva).reduce((acc,c)=>{
    const k = c.dataProva.slice(0,7);
    (acc[k] = acc[k] || []).push(c); return acc;
  }, {});
}
export function diasAte(dataISO){
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const d = new Date(dataISO); d.setHours(0,0,0,0);
  return Math.round((d - hoje) / 86400000);
}
```

- [ ] **Step 4: Recarregar `test/test.html`** e confirmar **PASS**.

- [ ] **Step 5: Escrever `calendario.html`** (`<div id="hd"></div>`, título "📅 Calendário de Provas", `#abas-mes`, `#tabela-mes`) + a parte de render em `calendario.js`: `montarHeader('calendario')`, carrega concursos, agrupa por mês, monta abas de mês com contagem, e ao selecionar um mês renderiza a tabela (Data · Órgão · UF · Status) com badge `Em Xd` quando `diasAte(dataProva)` entre 0 e 7.

- [ ] **Step 6: Verificar no navegador** (logado): abas de mês com contagem corretas; clicar num mês mostra as provas daquele mês na tabela; provas em ≤7 dias exibem badge "Em Xd". Meses sem provas mostram estado vazio.

- [ ] **Step 7: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/calendario.html Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/js/calendario.js Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/test/test.html
git commit -m "feat(cfc/mapa): calendário de provas por mês"
```

---

### Task 9: Detalhe do concurso, Favoritos, Alertas e Meu Perfil

**Files:**
- Create: `concurso.html`, `js/concurso.js`
- Create: `favoritos.html`, `js/favoritos.js`
- Create: `alertas.html`, `js/alertas.js`
- Create: `perfil.html`, `js/perfil.js`

**Interfaces:**
- Consumes: `carregarConcursos, filtrar` (data.js); `renderCard` (render.js); `store` (favoritos/alertas/usuário); `montarHeader`; `diasAte` (calendario.js).
- Produces: telas finais que fecham a navegação; `concurso.html?id=...` mostra o detalhe.

- [ ] **Step 1: `concurso.html` + `js/concurso.js`** — lê `id` da querystring, carrega concursos, acha o item, renderiza todos os campos, link do Edital, botão favoritar (usa `store.toggleFavorito`) e "Acompanhar prazo" (usa `store.toggleAlerta`). Item inexistente → mensagem "concurso não encontrado".

- [ ] **Step 2: Ligar o card ao detalhe** — em `render.js`, tornar o título do card um link para `concurso.html?id=${c.id}`. Reverificar a tela principal (Task 6) continua funcionando.

- [ ] **Step 3: `favoritos.html` + `js/favoritos.js`** — `montarHeader()`, carrega concursos, filtra os que estão em `store.getFavoritos()`, renderiza com `renderCard`. Vazio → "Você ainda não favoritou nenhum concurso."

- [ ] **Step 4: `alertas.html` + `js/alertas.js`** — `montarHeader('alertas')`, pega `store.getAlertas()`, mostra os concursos acompanhados ordenados por `diasAte(dataProva)` asc, com badge "Em Xd" (≤7d). Vazio → "Você não está acompanhando nenhum prazo."

- [ ] **Step 5: `perfil.html` + `js/perfil.js`** — `montarHeader('perfil')`, mostra `store.getUsuario().email`, um campo de nome (salvo no store — adicionar `store.setNome(nome)`/incluir em `getUsuario`), e botão Sair. Manter simples.

- [ ] **Step 6: Verificar navegação completa** (logado): app → clicar card abre detalhe → favoritar e acompanhar prazo → Favoritos lista o item → Alertas lista com badge → Perfil mostra e-mail → editar nome persiste → todas as páginas do header abrem e "Sair" desloga.

- [ ] **Step 7: Commit.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/
git commit -m "feat(cfc/mapa): detalhe, favoritos, alertas e perfil — navegação completa"
```

---

### Task 10: Responsividade, README e verificação final

**Files:**
- Modify: `css/style.css` (media queries)
- Create: `README.md`

**Interfaces:**
- Consumes: todas as telas.

- [ ] **Step 1: Media queries em `css/style.css`** — abaixo de ~900px: layout de 2 colunas empilha (mapa acima ou abaixo da lista), header vira coluna/compacto, cards ocupam largura total. Conferir que nada estoura horizontalmente.

- [ ] **Step 2: Escrever `README.md`** do projeto: o que é, como rodar localmente (`python -m http.server` na pasta), onde ficam os dados (`data/concursos.json`) e como adicionar um concurso, o que é simulado (login/favoritos/alertas via localStorage) e o que fica para a fase 2 (backend, admin, WhatsApp real, notificações).

- [ ] **Step 3: Verificação end-to-end final** no navegador, em largura desktop e mobile (DevTools responsive): landing → login → app (cards, busca, abas, ordenação, mapa clicável) → detalhe → favoritar/alerta → favoritos → alertas → calendário → perfil → sair. Rodar `test/test.html` uma última vez: todos os asserts **PASS**.

- [ ] **Step 4: Commit final.**

```bash
git add Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/
git commit -m "feat(cfc/mapa): responsividade, README e verificação final da fase front"
```

---

## Notas de handoff
- **Calibração de cores:** quando o Patrick enviar o logo/print da CFC, ajustar apenas `css/variables.css`.
- **Nome/domínio:** provisório ("CFC · Mapa de Concursos"); trocar o texto do logo em `header.js` e `index.html` quando definido.
- **Botão Grupo:** placeholder `#` até o link real do WhatsApp da CFC.
- **Print de "Meu Perfil":** não fornecido; a tela foi mantida simples e deve ser refinada se surgir o print.
