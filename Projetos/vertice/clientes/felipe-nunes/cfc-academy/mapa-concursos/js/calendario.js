import { montarHeader } from './header.js';
import { carregarConcursos } from './data.js';
import { dia, diasAte } from './render.js';

export function agruparPorMes(lista){
  return lista.filter(c=>c.dataProva).reduce((acc,c)=>{
    const k = c.dataProva.slice(0,7);
    (acc[k] = acc[k] || []).push(c); return acc;
  }, {});
}
// reexporta diasAte para manter compatibilidade com quem importa de calendario.js
export { diasAte };

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const statusLabel = s => s==='aberto' ? 'Aberto' : s==='encerrado' ? 'Encerrado' : 'Previsto';

function nomeMes(chave){
  const [ano, mes] = chave.split('-');
  return `${MESES[Number(mes)-1]} ${ano}`;
}

function montarLinha(c){
  const dd = diasAte(c.dataProva);
  const badge = (dd >= 0 && dd <= 7) ? `<span class="badge-prazo">${dd===0?'hoje':'em '+dd+'d'}</span>` : '';
  return `<tr>
    <td>${dia(c.dataProva)} ${badge}</td>
    <td>${c.orgao}</td>
    <td>${c.uf}</td>
    <td>${statusLabel(c.status)}</td>
  </tr>`;
}

function renderTabela(chave, grupos){
  const alvo = document.querySelector('#tabela-mes');
  if (!chave || !grupos[chave] || !grupos[chave].length) {
    alvo.innerHTML = '<div class="vazio"><p>Selecione um mês para ver as provas.</p></div>';
    return;
  }
  const lista = [...grupos[chave]].sort((a,b) => a.dataProva.localeCompare(b.dataProva));
  alvo.innerHTML = `<table class="cal-tabela">
      <thead><tr><th>Data</th><th>Órgão</th><th>UF</th><th>Status</th></tr></thead>
      <tbody>${lista.map(montarLinha).join('')}</tbody>
    </table>`;
}

function montarAbas(grupos){
  const chaves = Object.keys(grupos).sort();
  const alvo = document.querySelector('#abas-mes');
  const tituloEl = document.querySelector('#cal-titulo');
  if (!chaves.length) {
    alvo.innerHTML = '';
    document.querySelector('#tabela-mes').innerHTML = '<div class="vazio"><h3>Nenhuma prova agendada</h3><p>Os concursos com data de prova aparecerão aqui.</p></div>';
    return;
  }
  let selecionado = chaves[0];
  const desenhar = () => {
    if (tituloEl) tituloEl.textContent = nomeMes(selecionado);
    alvo.innerHTML = chaves.map(k => {
      const n = grupos[k].length;
      return `<button class="aba-mes ${selecionado===k?'aba-mes-on':''}" data-mes="${k}">
        ${MESES[Number(k.split('-')[1])-1]}<small>${n} prova${n>1?'s':''}</small></button>`;
    }).join('');
    alvo.querySelectorAll('[data-mes]').forEach(b =>
      b.addEventListener('click', () => { selecionado = b.dataset.mes; desenhar(); renderTabela(selecionado, grupos); }));
  };
  desenhar();
  renderTabela(selecionado, grupos);
}

if (document.querySelector('#abas-mes')) {
  montarHeader('calendario');
  carregarConcursos()
    .then(lista => montarAbas(agruparPorMes(lista)))
    .catch(() => {
      document.querySelector('#abas-mes').innerHTML = '';
      document.querySelector('#tabela-mes').innerHTML = '<div class="vazio"><h3>Não foi possível carregar o calendário</h3></div>';
    });
}
