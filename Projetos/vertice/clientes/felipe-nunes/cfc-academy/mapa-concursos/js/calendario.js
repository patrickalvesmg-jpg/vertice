import { montarHeader } from './header.js';
import { carregarConcursos } from './data.js';

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

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const dia = s => s ? new Date(s).toLocaleDateString('pt-BR') : '';
const statusLabel = s => s==='aberto' ? 'Aberto' : s==='encerrado' ? 'Encerrado' : 'Outro';

function nomeMes(chave){
  const [ano, mes] = chave.split('-');
  return `${MESES[Number(mes)-1]} ${ano}`;
}

function montarLinha(c){
  const dd = diasAte(c.dataProva);
  const badge = (dd >= 0 && dd <= 7) ? `<span class="badge-prazo">Em ${dd}d</span>` : '';
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
    alvo.innerHTML = '<p class="vazio">Selecione um mês para ver as provas.</p>';
    return;
  }
  const lista = [...grupos[chave]].sort((a,b) => a.dataProva.localeCompare(b.dataProva));
  alvo.innerHTML = `
    <h2 class="cal-titulo-mes">${nomeMes(chave)}</h2>
    <table class="cal-tabela">
      <thead><tr><th>Data</th><th>Órgão</th><th>UF</th><th>Status</th></tr></thead>
      <tbody>${lista.map(montarLinha).join('')}</tbody>
    </table>`;
}

function montarAbas(grupos){
  const chaves = Object.keys(grupos).sort();
  const alvo = document.querySelector('#abas-mes');
  if (!chaves.length) {
    alvo.innerHTML = '<p class="vazio">Nenhuma prova agendada.</p>';
    renderTabela(null, grupos);
    return;
  }
  let selecionado = chaves[0];
  const desenhar = () => {
    alvo.innerHTML = chaves.map(k =>
      `<button class="aba-mes ${selecionado===k?'aba-mes-on':''}" data-mes="${k}">${nomeMes(k).split(' ')[0]} / ${grupos[k].length} prova${grupos[k].length>1?'s':''}</button>`
    ).join('');
    alvo.querySelectorAll('[data-mes]').forEach(b =>
      b.addEventListener('click', () => { selecionado = b.dataset.mes; desenhar(); renderTabela(selecionado, grupos); }));
  };
  desenhar();
  renderTabela(selecionado, grupos);
}

// Só executa o render quando a página calendario.html estiver presente
// (evita disparar montarHeader/fetch ao importar as funções puras em test.html)
if (document.querySelector('#abas-mes')) {
  montarHeader('calendario');

  carregarConcursos()
    .then(lista => {
      const grupos = agruparPorMes(lista);
      montarAbas(grupos);
    })
    .catch(() => {
      document.querySelector('#abas-mes').innerHTML = '';
      document.querySelector('#tabela-mes').innerHTML = '<p class="vazio">Não foi possível carregar o calendário de provas.</p>';
    });
}
