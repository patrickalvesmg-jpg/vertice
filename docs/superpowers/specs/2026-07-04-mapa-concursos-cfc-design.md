# Design — Mapa de Concursos CFC (fase front)

**Data:** 2026-07-04
**Cliente:** Felipe Nunes · **Marca:** CFC Academy · **Agência:** Vertice
**Referência (concorrente):** `mapa.contabilidadefacilitada.com` — replicar funcionalidades, NÃO copiar código/dados.

---

## 1. Propósito

Plataforma web onde o concurseiro contábil acompanha **todos os concursos públicos da área contábil em um só lugar**. Espelha as funcionalidades do site de referência, com identidade visual da CFC Academy e arquitetura própria.

**Escopo desta fase:** apenas a **interface navegável** (front-end), alimentada por **dados de exemplo** em JSON. Login, cadastro, favoritos e alertas são **simulados no navegador** (sem servidor/banco). O objetivo é validar visual e fluxo antes de investir no backend.

**Fora de escopo (fases futuras):** autenticação real, banco de dados, painel admin, notificações por e-mail/push, sincronização de favoritos na nuvem.

---

## 2. Telas

| # | Tela | Conteúdo |
|---|------|----------|
| 1 | **Landing (pública)** | Capa com marca CFC, headline, os 3 recursos (concursos atualizados, alertas de prazo, favoritos na nuvem), botões "Entrar" e "Primeiro acesso". Rodapé com © e marca. |
| 2 | **Login / Cadastro** | Formulário e-mail + senha. Simulado: qualquer credencial entra na demo (marca sessão via `localStorage`). Link alterna entre login e cadastro. |
| 3 | **Mapa / Lista de concursos** | Tela principal. Cards/lista de concursos exibindo: título, banca, órgão, cargo contábil, nº de vagas, salário, datas (inscrição início/fim, prova), status (aberto / previsto / encerrado). Barra de **busca** (texto) + **filtros** (estado/UF, status, banca). Botão favoritar em cada card. |
| 4 | **Detalhe do concurso** | Página de um concurso: todas as infos do item, link externo do edital, botão favoritar, botão "acompanhar prazo" (cria alerta). |
| 5 | **Favoritos** | Lista dos concursos salvos pelo usuário (lidos do `localStorage`). Estado vazio tratado. |
| 6 | **Alertas** | Concursos que o usuário acompanha, ordenados por proximidade do prazo. Destaque visual para prazos próximos (ex.: ≤ 7 dias). Estado vazio tratado. |

> Estas telas serão refinadas quando o cliente enviar os **prints** das telas internas da referência, para bater com o que eles realmente oferecem.

---

## 3. Arquitetura técnica

- **Stack:** HTML + CSS + JavaScript puro (sem framework), seguindo o padrão dos demais projetos do repositório. Publicável em GitHub Pages.
- **Dados:** arquivo `concursos.json` com um array de concursos de exemplo. Editar esse arquivo é o "cadastro" desta fase (vira painel admin no futuro).
- **Estado do usuário:** `localStorage` guarda sessão simulada, favoritos e alertas (por navegador).
- **Identidade visual:** variáveis CSS num único arquivo (`css/variables.css`) com a paleta azul da CFC Academy, calibrável depois com print/logo.

### Estrutura de pastas
```
Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos/
├── index.html              # Landing pública
├── login.html              # Login / cadastro
├── app.html                # Mapa / lista de concursos (área logada)
├── concurso.html           # Detalhe (recebe id via querystring)
├── favoritos.html          # Favoritos
├── alertas.html            # Alertas
├── css/
│   ├── variables.css       # Paleta CFC + tipografia (ponto único de calibração)
│   └── style.css           # Estilos gerais
├── js/
│   ├── data.js             # Carrega concursos.json
│   ├── store.js            # localStorage: sessão, favoritos, alertas
│   └── app.js              # Render de listas, busca, filtros
└── data/
    └── concursos.json      # Dados de exemplo
```

### Modelo de dado — um concurso
```json
{
  "id": "trf5-2026",
  "titulo": "TRF 5ª Região — Analista Judiciário (Contabilidade)",
  "orgao": "Tribunal Regional Federal 5ª Região",
  "banca": "FCC",
  "cargo": "Analista Judiciário — Contabilidade",
  "uf": "PE",
  "vagas": 12,
  "salario": 13994.78,
  "status": "aberto",
  "inscricaoInicio": "2026-07-01",
  "inscricaoFim": "2026-07-31",
  "dataProva": "2026-09-14",
  "editalUrl": "https://exemplo.gov.br/edital.pdf"
}
```
`status` ∈ { `aberto`, `previsto`, `encerrado` }.

### Isolamento dos módulos
- `store.js` — única fonte de verdade do estado do usuário; expõe funções (`login`, `logout`, `isLogged`, `toggleFavorito`, `getFavoritos`, `toggleAlerta`, `getAlertas`). Nenhuma outra parte toca `localStorage` diretamente.
- `data.js` — única responsável por buscar/entregar os concursos; abstrai a origem (hoje JSON, amanhã API).
- `app.js` — renderiza e reage à UI; consome `data.js` e `store.js` por suas interfaces.
- Páginas logadas checam `store.isLogged()` e redirecionam para `login.html` se não houver sessão.

---

## 4. Tratamento de erros e estados vazios

- **JSON não carrega:** exibir mensagem amigável ("não foi possível carregar os concursos") em vez de tela quebrada.
- **Busca/filtro sem resultado:** estado vazio com texto orientando ("nenhum concurso encontrado — ajuste os filtros").
- **Favoritos/Alertas vazios:** estado vazio convidando a explorar o mapa.
- **Acesso a página logada sem sessão:** redireciona para login.

---

## 5. Testabilidade

Cada módulo tem responsabilidade única e interface clara, permitindo verificação isolada:
- `store.js` — testável via chamadas diretas (favoritar → aparece em getFavoritos).
- `data.js` — testável carregando o JSON e conferindo o parse.
- Fluxo end-to-end verificado abrindo as páginas no navegador (login → mapa → favoritar → ver em favoritos).

---

## 6. Fora de escopo desta fase (registrado para não haver ambiguidade)

Autenticação real, banco de dados, painel administrativo, favoritos/alertas sincronizados na nuvem, notificações automáticas. Tudo isso é fase 2 (backend), a ser especificado depois que o visual for validado.
