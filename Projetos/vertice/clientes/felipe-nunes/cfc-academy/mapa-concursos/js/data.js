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
