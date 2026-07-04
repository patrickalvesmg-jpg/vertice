import { montarHeader } from './header.js';
import { carregarConcursos } from './data.js';
import { store } from './store.js';
import { dia, diasAte } from './render.js';

const brl = v => v == null ? '' : v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
const nivelLabel = { federal:'Federal', estadual:'Estadual', municipal:'Municipal', distrital:'Distrital' };

const statusRot = c => c.status==='aberto' ? {cls:'st-open',txt:'Inscrições abertas'}
  : c.status==='encerrado' ? {cls:'st-closed',txt:'Encerrado'} : {cls:'st-other',txt:'Previsto'};

// timeline: inscrição → prova → resultado, marcando etapa atual
function timeline(c){
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const dFim = diasAte(c.inscricaoFim);
  const dProva = diasAte(c.dataProva);
  const steps = [
    { k:'Inscrições', v:`${dia(c.inscricaoInicio)} – ${dia(c.inscricaoFim)}`, done: dFim!=null && dFim<0, now: dFim!=null && dFim>=0 },
    { k:'Prova', v: dia(c.dataProva), done: dProva!=null && dProva<0, now:false },
    { k:'Resultado', v:'A divulgar', done:false, now:false },
  ];
  // "now" = etapa corrente: inscrição se ainda aberta, senão prova se futura
  if (!(dFim!=null && dFim>=0) && dProva!=null && dProva>=0) steps[1].now = true;
  return `<div class="det-timeline">${steps.map(s =>
    `<div class="tl-step ${s.done?'done':''} ${s.now?'now':''}">
       <span class="k">${s.k}</span><span class="v">${s.v}</span></div>`).join('')}</div>`;
}

function renderDetalhe(c){
  const st = statusRot(c);
  const fav = store.isFavorito(c.id) ? 'fav-on' : '';
  const alerta = store.isAlerta(c.id);
  const obs = c.salarioObs ? `<small>${c.salarioObs}</small>` : '';
  const wpp = `https://wa.me/?text=${encodeURIComponent(`Concurso: ${c.orgao} — ${c.cargo}. Salário ${brl(c.salario)}. Inscrições até ${dia(c.inscricaoFim)}.`)}`;
  return `
    <a href="app.html" class="detalhe-voltar">← Voltar para a lista</a>
    <div class="det-head">
      <div>
        <span class="conc-status ${st.cls} det-status"><span class="d"></span> ${st.txt}</span>
        <h1 class="det-org">${c.orgao}</h1>
        <p class="det-cargo">${c.cargo}</p>
      </div>
      <div class="det-sal">${brl(c.salario)}${obs}</div>
    </div>

    ${timeline(c)}

    <div class="det-grid">
      <div class="det-cell"><span class="k">Banca</span><span class="v">${c.banca}</span></div>
      <div class="det-cell"><span class="k">Vagas</span><span class="v">${c.vagas}</span></div>
      <div class="det-cell"><span class="k">Nível</span><span class="v">${nivelLabel[c.nivel]||c.nivel||'—'}</span></div>
      <div class="det-cell"><span class="k">Escolaridade</span><span class="v">${c.escolaridade==='superior'?'Superior':'Médio'}</span></div>
      <div class="det-cell"><span class="k">Carga horária</span><span class="v">${c.cargaHoraria||'—'}</span></div>
      <div class="det-cell"><span class="k">Taxa de inscrição</span><span class="v">${c.taxaInscricao!=null?brl(c.taxaInscricao):'—'}</span></div>
      <div class="det-cell"><span class="k">Local da prova</span><span class="v">${c.localProva||c.cidade+'/'+c.uf}</span></div>
      <div class="det-cell"><span class="k">Atualizado em</span><span class="v">${dia(c.atualizadoEm)}</span></div>
    </div>

    <div class="det-acoes">
      <button class="btn-fav ${fav}" data-fav="${c.id}" aria-label="Favoritar">${fav?'♥':'♡'}</button>
      <button class="btn ${alerta?'btn-alerta-on':'btn-primary'}" id="btn-alerta">
        ${alerta ? '✓ Acompanhando prazo' : 'Acompanhar prazo'}
      </button>
      <a class="btn btn-wpp" href="${wpp}" target="_blank" rel="noopener">Compartilhar no WhatsApp</a>
      <a class="btn btn-outline" href="${c.editalUrl}" target="_blank" rel="noopener">Edital ↗</a>
    </div>

    <div class="painel-cta" style="margin-top:34px">
      <h3>Quer passar nesse concurso?</h3>
      <p>Os aprovados da CFC Academy estudam com o Método 3R. Veja como se preparar para ${c.cargo} do ${c.orgao}.</p>
      <a href="#">Quero me preparar ›</a>
    </div>`;
}

function ligarBotoes(c){
  document.querySelectorAll('[data-fav]').forEach(b =>
    b.addEventListener('click', () => { store.toggleFavorito(c.id); montar(c); }));
  const bt = document.querySelector('#btn-alerta');
  if (bt) bt.addEventListener('click', () => { store.toggleAlerta(c.id); montar(c); });
}
function montar(c){
  const alvo = document.querySelector('#detalhe');
  alvo.innerHTML = renderDetalhe(c);
  ligarBotoes(c);
}

montarHeader();
const id = new URLSearchParams(location.search).get('id');
carregarConcursos()
  .then(lista => {
    const c = lista.find(x => x.id === id);
    if (!c){ document.querySelector('#detalhe').innerHTML = '<div class="vazio"><h3>Concurso não encontrado</h3><p><a href="app.html">Voltar para a lista</a></p></div>'; return; }
    montar(c);
  })
  .catch(() => { document.querySelector('#detalhe').innerHTML = '<div class="vazio"><h3>Não foi possível carregar o concurso</h3></div>'; });
