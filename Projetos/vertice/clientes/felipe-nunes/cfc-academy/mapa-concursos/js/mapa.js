import { contarPorUF } from './data.js';

export async function montarMapa(container, lista, onSelecionar){
  if (!container) return;
  try {
    const resp = await fetch('assets/brasil.svg');
    if (!resp.ok) throw new Error('falha ao carregar mapa');
    const svg = await resp.text();

    container.innerHTML = `
      <div class="mapa-head">Mapa do Brasil</div>
      <p class="mapa-sub">Clique em um estado para filtrar</p>
      <div class="mapa-svg">${svg}</div>
      <div class="mapa-legenda">
        <span><i class="lg lg-com"></i> Com concursos</span>
        <span><i class="lg lg-sel"></i> Selecionado</span>
        <span><i class="lg lg-sem"></i> Sem concursos</span>
      </div>`;

    const cont = contarPorUF(lista);
    let selecionado = '';
    // Seleciona todos os elementos de estado (polygon e path) que têm id de UF.
    const estados = [...container.querySelectorAll('.mapa-svg .state')].filter(el => el.id);

    estados.forEach(el => {
      const uf = el.id;
      const n = cont[uf] || 0;
      el.classList.add(n ? 'uf-com' : 'uf-sem');

      const titulo = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titulo.textContent = n ? `${uf} (${n})` : uf;
      el.appendChild(titulo);

      el.addEventListener('click', () => {
        selecionado = (selecionado === uf ? '' : uf);
        estados.forEach(x => x.classList.toggle('uf-sel', x.id === selecionado));
        onSelecionar(selecionado);
      });
    });
  } catch (e) {
    container.innerHTML = '<p class="vazio">Não foi possível carregar o mapa.</p>';
  }
}
