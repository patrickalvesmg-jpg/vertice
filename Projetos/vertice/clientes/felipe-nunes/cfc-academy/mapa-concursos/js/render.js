import { store } from './store.js';

const brl = v => v==null ? '' : v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

// Datas "AAAA-MM-DD" (sem horário) precisam de parse local para não cair um dia (UTC).
// Datas com horário ("AAAA-MM-DDTHH:mm") já são locais no Date nativo.
export const dia = s => {
  if (!s) return '';
  if (s.length === 10) {
    const [ano, mes, d] = s.split('-').map(Number);
    return new Date(ano, mes - 1, d).toLocaleDateString('pt-BR');
  }
  return new Date(s).toLocaleDateString('pt-BR');
};
// só dia/mês, para prazos ("31/08")
const diaMes = s => { const t = dia(s); return t ? t.slice(0,5) : ''; };

// dias a partir de hoje (parse local, sem off-by-one)
export function diasAte(dataISO){
  if (!dataISO) return null;
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const base = dataISO.slice(0,10);
  const [ano, mes, d] = base.split('-').map(Number);
  const alvo = new Date(ano, mes - 1, d);
  return Math.round((alvo - hoje) / 86400000);
}

const rotuloStatus = c => {
  if (c.status === 'aberto') return { cls:'st-open', txt:'Inscrições abertas' };
  if (c.status === 'encerrado') return { cls:'st-closed', txt:'Encerrado' };
  return { cls:'st-other', txt:'Previsto' };
};

// linha de prazo contextual: abre em breve / encerra em X / encerrado
function linhaPrazo(c){
  if (c.status === 'encerrado') return 'Inscrições encerradas';
  const dIni = diasAte(c.inscricaoInicio);
  const dFim = diasAte(c.inscricaoFim);
  if (dIni != null && dIni > 0) return `Inscrições a partir de <b>${diaMes(c.inscricaoInicio)}</b>`;
  if (dFim != null && dFim >= 0){
    const urg = dFim <= 7 ? ' urg' : '';
    const faltam = dFim === 0 ? 'último dia' : `faltam ${dFim} dia${dFim>1?'s':''}`;
    return `Encerra em <b>${diaMes(c.inscricaoFim)}</b> · <span class="${urg}">${faltam}</span>`;
  }
  return '';
}

export function renderCard(c){
  const st = rotuloStatus(c);
  const fav = store.isFavorito(c.id) ? 'fav-on' : '';
  const abertoCls = c.status === 'aberto' ? 'conc-aberto' : '';
  const obs = c.salarioObs ? `<small>${c.salarioObs}</small>` : '';
  return `<article class="conc ${abertoCls}">
    <div class="conc-main">
      <span class="conc-status ${st.cls}"><span class="d"></span> ${st.txt}</span>
      <a class="conc-titulo-link" href="concurso.html?id=${c.id}">${c.orgao}</a>
      <p class="conc-cargo">${c.cargo}</p>
      <div class="conc-meta">
        <span><span class="k">Banca</span> ${c.banca}</span>
        <span><span class="k">Local</span> ${c.cidade||''}/${c.uf}</span>
        <span><span class="k">Vagas</span> ${c.vagas}</span>
        <span><span class="k">Prova</span> ${dia(c.dataProva)}</span>
      </div>
    </div>
    <div class="conc-side">
      <div class="conc-sal">${brl(c.salario)}${obs}</div>
      <div class="conc-deadline">${linhaPrazo(c)}</div>
      <div class="conc-acoes">
        <button class="btn-fav ${fav}" data-fav="${c.id}" aria-label="Favoritar">${fav?'♥':'♡'}</button>
        <a class="btn-edital" href="${c.editalUrl}" target="_blank" rel="noopener">Edital ↗</a>
      </div>
    </div>
  </article>`;
}
