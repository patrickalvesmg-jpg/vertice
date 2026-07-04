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

> Refinado a partir dos **prints reais** das telas internas da referência (2026-07-04).

### Header da área logada (comum às telas logadas)
Barra superior azul-marinho com logo à esquerda e, à direita:
**Calendário** · **Meu Perfil** · **Alertas** (botão laranja) · **Grupo** (botão verde, WhatsApp — link placeholder `#` nesta fase) · **Sair**.

### Telas

| # | Tela | Conteúdo |
|---|------|----------|
| 1 | **Landing (pública)** | Capa com marca CFC, headline, os 3 recursos (concursos atualizados, alertas de prazo, favoritos na nuvem), botões "Entrar" e "Primeiro acesso". Rodapé com © e marca. |
| 2 | **Login / Cadastro** | Formulário e-mail + senha. Simulado: qualquer credencial entra na demo (marca sessão via `localStorage`). Link alterna entre login e cadastro. |
| 3 | **Mapa / Lista de concursos** (principal) | Layout em 2 colunas. **Coluna esquerda:** contador ("N concursos"), botão favoritos + botão atualizar, dropdown de **ordenação** ("Mais recentes"), barra de **busca** ("órgão, cargo, banca…"), **abas de status com contagem** (Todos / Abertas / Encerradas / Outros), botão **Filtros avançados**, e a **lista de cards** de concurso. **Coluna direita:** o **Mapa do Brasil** (ver abaixo). |
| 4 | **Calendário de Provas** | **Abas por mês** (Jan…Dez) cada uma com a **contagem de provas** do mês. Abaixo, **tabela** do mês selecionado: Data · Órgão · UF · Status (badge "Em Xd" quando a prova está próxima). Botão atualizar. |
| 5 | **Detalhe do concurso** | Todas as infos do concurso, link externo do edital, botão favoritar, botão "acompanhar prazo" (cria alerta). |
| 6 | **Favoritos** | Lista dos concursos salvos (lidos do `localStorage`). Estado vazio tratado. |
| 7 | **Alertas** | Concursos que o usuário acompanha, ordenados por proximidade do prazo, com destaque para prazos próximos (badge "Em Xd", ≤ 7 dias). Estado vazio tratado. |
| 8 | **Meu Perfil** | Dados simulados do usuário (nome, e-mail) e preferências. Simples nesta fase. |

### Card de concurso (conteúdo de cada item da lista)
Fiel ao print: **órgão** (título) + badge de **status** ("Inscrições Abertas" laranja / "Inscrições Encerradas" cinza); **cargo** (ex.: Contador); **salário** (formatado, pode ter "+ benefícios"); **data da prova**; linha com **cidade/UF** · **vagas** (ex.: "1 + CR") · **banca** · **carga horária** (ex.: 40h); **período de inscrições** com horário (ex.: "08h 19/08/2026 a 18/09/2026 16h"); **local da prova**; **data de atualização** ("Atualizado em: …"); botões **coração** (favoritar) e **Edital** (link externo). Cards abertos têm borda/realce lateral.

### Mapa do Brasil (coluna direita da tela principal)
Card "Mapa do Brasil — Clique em um estado para filtrar". **SVG completo e clicável** dos 27 estados. Cada estado é **colorido conforme quantidade de concursos** e exibe a **contagem** (ex.: "SP (54)", "PR (27)"). Clicar num estado **filtra a lista** por aquela UF; clicar de novo limpa. Legenda: **Com concursos** (azul-marinho) · **Selecionado** (laranja) · **Sem concursos** (cinza).

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
├── app.html                # Mapa / lista de concursos (tela principal)
├── calendario.html         # Calendário de provas por mês
├── concurso.html           # Detalhe (recebe id via querystring)
├── favoritos.html          # Favoritos
├── alertas.html            # Alertas
├── perfil.html             # Meu Perfil
├── css/
│   ├── variables.css       # Paleta CFC + tipografia (ponto único de calibração)
│   └── style.css           # Estilos gerais
├── js/
│   ├── data.js             # Carrega concursos.json
│   ├── store.js            # localStorage: sessão, favoritos, alertas
│   ├── header.js           # Renderiza o header comum da área logada
│   ├── mapa.js             # Lógica do mapa SVG do Brasil (contagem/cores/clique)
│   ├── calendario.js       # Agrupa provas por mês, monta abas e tabela
│   └── app.js              # Lista principal: render de cards, busca, abas, filtros, ordenação
├── assets/
│   └── brasil.svg          # Mapa do Brasil (paths dos 27 estados, com id por UF)
└── data/
    └── concursos.json      # Dados de exemplo
```

### Modelo de dado — um concurso
```json
{
  "id": "conc-barra-minas-2026",
  "orgao": "Prefeitura de Conceição da Barra de Minas/MG",
  "cargo": "Contador",
  "banca": "JCM Concursos",
  "uf": "MG",
  "cidade": "Conceição da Barra de Minas",
  "vagas": "1",
  "salario": 4856.66,
  "salarioObs": "",
  "cargaHoraria": "40h",
  "status": "aberto",
  "inscricaoInicio": "2026-08-19T08:00",
  "inscricaoFim": "2026-09-18T16:00",
  "dataProva": "2026-10-17",
  "localProva": "Conceição da Barra de Minas/MG",
  "atualizadoEm": "2026-06-21",
  "editalUrl": "https://exemplo.gov.br/edital.pdf"
}
```
- `status` ∈ { `aberto`, `encerrado`, `outro` } (mapeados às abas Abertas / Encerradas / Outros).
- `vagas` é texto para admitir formatos como "1 + CR".
- `salarioObs` cobre casos como "+ benefícios".

### Isolamento dos módulos
- `store.js` — única fonte de verdade do estado do usuário; expõe (`login`, `logout`, `isLogged`, `getUsuario`, `toggleFavorito`, `getFavoritos`, `toggleAlerta`, `getAlertas`). Nenhuma outra parte toca `localStorage` diretamente.
- `data.js` — única responsável por buscar/entregar os concursos; deriva também **contagens por UF** (para o mapa) e **por status** (para as abas). Abstrai a origem (hoje JSON, amanhã API).
- `header.js` — injeta o header comum (Calendário/Perfil/Alertas/Grupo/Sair) nas páginas logadas.
- `mapa.js` — pinta o `brasil.svg` por contagem, aplica cor de selecionado, emite o UF clicado.
- `calendario.js` — agrupa provas por mês, monta abas com contagem e a tabela do mês.
- `app.js` — orquestra a tela principal: cards, busca, abas de status, ordenação, filtros avançados, e reage ao clique no mapa.
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
- `data.js` — testável carregando o JSON e conferindo o parse, as contagens por UF e por status.
- `mapa.js` / `calendario.js` — testáveis a partir de um array de concursos conhecido (contagens e agrupamentos corretos).
- Fluxo end-to-end verificado abrindo as páginas no navegador (login → mapa → clicar estado filtra → favoritar → ver em favoritos → calendário mostra provas do mês).

---

## 6. Fora de escopo desta fase (registrado para não haver ambiguidade)

Autenticação real, banco de dados, painel administrativo (cadastro/atualização de concursos por interface), favoritos/alertas sincronizados na nuvem entre dispositivos, notificações automáticas por e-mail/WhatsApp, e o destino real do botão "Grupo". Tudo isso é fase 2 (backend), a ser especificado depois que o visual for validado.

O **mapa SVG do Brasil** e o **calendário de provas** estão **dentro** do escopo desta fase (são o coração da experiência, conforme os prints).
