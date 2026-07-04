import { contarPorUF } from './data.js';

const SVGNS = 'http://www.w3.org/2000/svg';

export async function montarMapa(container, lista, onSelecionar){
  if (!container) return;
  try {
    const resp = await fetch('assets/brasil.svg');
    if (!resp.ok) throw new Error('falha ao carregar mapa');
    const svg = await resp.text();

    container.innerHTML = `
      <div class="mapa-head">Onde estão as vagas</div>
      <p class="mapa-sub">Toque num estado para filtrar</p>
      <div class="mapa-svg">${svg}</div>
      <div class="mapa-legenda">
        <span><i class="lg lg-com"></i> Com vagas</span>
        <span><i class="lg lg-sel"></i> Selecionado</span>
        <span><i class="lg lg-sem"></i> Sem vagas</span>
      </div>`;

    const cont = contarPorUF(lista);
    let selecionado = '';
    const svgEl = container.querySelector('.mapa-svg svg');
    const estados = [...container.querySelectorAll('.mapa-svg .state')].filter(el => el.id);

    // camada de rótulos numéricos, desenhada por cima dos estados
    const labels = document.createElementNS(SVGNS, 'g');
    labels.setAttribute('class', 'mapa-labels');
    svgEl.appendChild(labels);

    estados.forEach(el => {
      const uf = el.id;
      const n = cont[uf] || 0;
      el.classList.add(n ? 'uf-com' : 'uf-sem');

      // acessibilidade / tooltip nativo
      const titulo = document.createElementNS(SVGNS, 'title');
      titulo.textContent = n ? `${uf}: ${n} concurso${n>1?'s':''}` : `${uf}: sem concursos`;
      el.appendChild(titulo);

      // rótulo numérico visível (apenas para estados com concursos)
      if (n){
        let cx, cy;
        try { const b = el.getBBox(); cx = b.x + b.width/2; cy = b.y + b.height/2; }
        catch(_) { cx = 0; cy = 0; }
        const txt = document.createElementNS(SVGNS, 'text');
        txt.setAttribute('x', cx); txt.setAttribute('y', cy);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('dominant-baseline', 'central');
        txt.setAttribute('class', 'uf-label');
        txt.textContent = String(n);
        labels.appendChild(txt);
      }

      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        selecionado = (selecionado === uf ? '' : uf);
        estados.forEach(x => x.classList.toggle('uf-sel', x.id === selecionado));
        onSelecionar(selecionado);
      });
    });
  } catch (e) {
    container.innerHTML = '<p class="mapa-sub">Não foi possível carregar o mapa.</p>';
  }
}
