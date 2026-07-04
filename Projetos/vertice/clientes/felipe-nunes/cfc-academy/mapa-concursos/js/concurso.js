import { montarHeader } from './header.js';
import { carregarConcursos } from './data.js';
import { store } from './store.js';

const brl = v => v == null ? '' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Datas "AAAA-MM-DD" (sem horário) precisam de parse local para não cair um dia por causa do UTC.
// Datas com horário ("AAAA-MM-DDTHH:mm") já são interpretadas em horário local pelo Date nativo.
function formatarData(s) {
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [ano, mes, dia] = s.split('-').map(Number);
    return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
  }
  return new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + new Date(s).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const statusLabel = s => s === 'aberto' ? 'Inscrições Abertas' : s === 'encerrado' ? 'Inscrições Encerradas' : 'Outros';

function renderDetalhe(c) {
  const fav = store.isFavorito(c.id) ? 'fav-on' : '';
  const alerta = store.isAlerta(c.id);
  return `
    <a href="app.html" class="conc-titulo-link">← Voltar para a lista</a>
    <article class="card" style="margin-top:16px;">
      <div class="conc-top">
        <h3 style="font-size:22px;">${c.orgao}</h3>
        <span class="badge ${c.status === 'aberto' ? 'badge-aberto' : c.status === 'encerrado' ? 'badge-enc' : ''}">${statusLabel(c.status)}</span>
      </div>
      <p class="conc-cargo" style="font-size:16px;">${c.cargo}</p>

      <p class="conc-linha">💲 Salário: ${brl(c.salario)}${c.salarioObs ? ' ' + c.salarioObs : ''}</p>
      <p class="conc-meta">📍 Local: ${c.cidade || ''}/${c.uf}</p>
      <p class="conc-meta">🏢 Banca: ${c.banca}</p>
      <p class="conc-meta">👥 Vagas: ${c.vagas}</p>
      <p class="conc-meta">⏱️ Carga horária: ${c.cargaHoraria || ''}</p>
      <p class="conc-meta">🗓️ Inscrições: ${formatarData(c.inscricaoInicio)} a ${formatarData(c.inscricaoFim)}</p>
      <p class="conc-meta">📅 Data da prova: ${formatarData(c.dataProva)}</p>
      ${c.localProva ? `<p class="conc-meta"><b>Local da prova:</b> ${c.localProva}</p>` : ''}
      <p class="conc-atual">Atualizado em: ${formatarData(c.atualizadoEm)}</p>

      <div class="conc-acoes">
        <button class="btn-fav ${fav}" data-fav="${c.id}">♥</button>
        <button class="btn ${alerta ? 'btn-destaque' : 'btn-primary'}" id="btn-alerta" data-alerta="${c.id}">
          ${alerta ? '🔔 Acompanhando prazo' : '🔔 Acompanhar prazo'}
        </button>
        <a class="btn btn-primary" href="${c.editalUrl}" target="_blank" rel="noopener">↗ Edital</a>
      </div>
    </article>`;
}

function ligarBotoes(c) {
  document.querySelectorAll('[data-fav]').forEach(b =>
    b.addEventListener('click', () => {
      store.toggleFavorito(b.dataset.fav);
      montar(c);
    }));
  const btnAlerta = document.querySelector('#btn-alerta');
  if (btnAlerta) {
    btnAlerta.addEventListener('click', () => {
      store.toggleAlerta(c.id);
      montar(c);
    });
  }
}

function montar(c) {
  const alvo = document.querySelector('#detalhe');
  alvo.innerHTML = renderDetalhe(c);
  ligarBotoes(c);
}

montarHeader();

const id = new URLSearchParams(location.search).get('id');

carregarConcursos()
  .then(lista => {
    const c = lista.find(item => item.id === id);
    if (!c) {
      document.querySelector('#detalhe').innerHTML = '<p class="vazio">Concurso não encontrado.</p>';
      return;
    }
    montar(c);
  })
  .catch(() => {
    document.querySelector('#detalhe').innerHTML = '<p class="vazio">Não foi possível carregar o concurso.</p>';
  });
