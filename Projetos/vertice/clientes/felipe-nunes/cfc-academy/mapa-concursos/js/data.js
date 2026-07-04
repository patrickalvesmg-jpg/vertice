export async function carregarConcursos(){
  const r = await fetch('data/concursos.json');
  if (!r.ok) throw new Error('falha ao carregar concursos');
  return r.json();
}

// Normaliza o status para uma das 3 categorias das abas: qualquer valor
// que não seja 'aberto'/'encerrado' é tratado como 'outro' (contrato do README).
export function statusCategoria(status){
  return (status === 'aberto' || status === 'encerrado') ? status : 'outro';
}

export function contarPorUF(lista){
  return lista.reduce((acc, c) => { acc[c.uf] = (acc[c.uf]||0)+1; return acc; }, {});
}
export function contarPorStatus(lista){
  const base = { todos: lista.length, aberto:0, encerrado:0, outro:0 };
  return lista.reduce((acc, c) => { acc[statusCategoria(c.status)]++; return acc; }, base);
}

// Extrai as opções distintas de um campo (para montar chips de filtro dinamicamente)
export function opcoesDe(lista, campo){
  return [...new Set(lista.map(c => c[campo]).filter(Boolean))].sort();
}

/*
 * filtrar — aplica o conjunto completo de filtros.
 * Aceita:
 *   texto   : busca em órgão, cargo, banca, cidade e UF (case-insensitive)
 *   uf      : sigla exata
 *   status  : categoria de status ('aberto'/'encerrado'/'outro')
 *   bancas  : array de bancas (match se a banca do concurso está no array)
 *   niveis  : array de níveis ('federal'/'estadual'/'municipal'/'distrital')
 *   escolaridades : array ('superior'/'medio')
 *   cargos  : array de "família" de cargo (checa se o cargo contém o termo)
 *   salarioMin : número — salário >= valor
 *   soAbertas  : boolean — apenas status 'aberto'
 */
export function filtrar(lista, f = {}){
  const {
    texto='', uf='', status='',
    bancas=[], niveis=[], escolaridades=[], cargos=[],
    salarioMin=0, soAbertas=false,
  } = f;
  const t = texto.trim().toLowerCase();
  return lista.filter(c => {
    if (uf && c.uf !== uf) return false;
    if (status && statusCategoria(c.status) !== status) return false;
    if (soAbertas && c.status !== 'aberto') return false;
    if (bancas.length && !bancas.includes(c.banca)) return false;
    if (niveis.length && !niveis.includes(c.nivel)) return false;
    if (escolaridades.length && !escolaridades.includes(c.escolaridade)) return false;
    if (salarioMin && (c.salario || 0) < salarioMin) return false;
    if (cargos.length){
      const cargo = (c.cargo || '').toLowerCase();
      if (!cargos.some(k => cargo.includes(k.toLowerCase()))) return false;
    }
    if (t && !`${c.orgao} ${c.cargo} ${c.banca} ${c.cidade||''} ${c.uf}`.toLowerCase().includes(t)) return false;
    return true;
  });
}

// Conta quantos filtros de f estão ativos (para o rótulo do botão / limpar)
export function contarFiltrosAtivos(f = {}){
  let n = 0;
  if (f.uf) n++;
  if (f.bancas && f.bancas.length) n += f.bancas.length;
  if (f.niveis && f.niveis.length) n += f.niveis.length;
  if (f.escolaridades && f.escolaridades.length) n += f.escolaridades.length;
  if (f.cargos && f.cargos.length) n += f.cargos.length;
  if (f.salarioMin) n++;
  if (f.soAbertas) n++;
  return n;
}

/*
 * ordenar — critérios úteis para quem procura concurso.
 *   'salario'   : maior salário primeiro
 *   'prazo'     : inscrições encerrando antes primeiro (só as com inscrição futura)
 *   'prova'     : data da prova mais próxima primeiro
 *   'vagas'     : mais vagas primeiro (extrai o primeiro número de "3 + CR")
 *   'recentes'  : atualizadoEm desc (padrão)
 */
const numVagas = v => { const m = String(v||'').match(/\d+/); return m ? +m[0] : 0; };
export function ordenar(lista, criterio='salario'){
  const copia = [...lista];
  switch (criterio){
    case 'salario':
      copia.sort((a,b) => (b.salario||0) - (a.salario||0)); break;
    case 'prazo':
      copia.sort((a,b) => (a.inscricaoFim||'zzzz').localeCompare(b.inscricaoFim||'zzzz')); break;
    case 'prova':
      copia.sort((a,b) => (a.dataProva||'zzzz').localeCompare(b.dataProva||'zzzz')); break;
    case 'vagas':
      copia.sort((a,b) => numVagas(b.vagas) - numVagas(a.vagas)); break;
    case 'recentes':
    default:
      copia.sort((a,b) => (b.atualizadoEm||'').localeCompare(a.atualizadoEm||''));
  }
  return copia;
}
