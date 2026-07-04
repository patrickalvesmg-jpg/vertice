import { store } from './store.js';
const brl = v => v==null ? '' : v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
// Datas "AAAA-MM-DD" (sem horário) precisam de parse local para não cair um dia por causa do UTC.
// Datas com horário ("AAAA-MM-DDTHH:mm") já são interpretadas em horário local pelo Date nativo.
const dia = s => {
  if (!s) return '';
  if (s.length === 10) {
    const [ano, mes, d] = s.split('-').map(Number);
    return new Date(ano, mes - 1, d).toLocaleDateString('pt-BR');
  }
  return new Date(s).toLocaleDateString('pt-BR');
};
export function renderCard(c){
  const aberto = c.status === 'aberto';
  const badge = aberto ? '<span class="badge badge-aberto">Inscrições Abertas</span>'
    : c.status==='encerrado' ? '<span class="badge badge-enc">Inscrições Encerradas</span>'
    : '<span class="badge">Outros</span>';
  const fav = store.isFavorito(c.id) ? 'fav-on' : '';
  return `<article class="conc ${aberto?'conc-aberto':''}">
    <div class="conc-top"><h3><a class="conc-titulo-link" href="concurso.html?id=${c.id}">${c.orgao}</a></h3>${badge}</div>
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
