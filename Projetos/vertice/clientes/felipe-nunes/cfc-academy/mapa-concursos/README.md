# Mapa de Concursos CFC

Plataforma web para acompanhar concursos públicos na área contábil (Contador, Auditor Contador, Técnico em Contabilidade etc.), com listagem filtrável, mapa do Brasil clicável por UF, calendário de provas, favoritos e alertas de prazo.

Projeto do **CFC Academy** (cliente Felipe Nunes / Vertice) — fase de front-end estático, sem backend.

## O que é

- **Landing page** (`index.html`) apresentando a plataforma.
- **Login/cadastro simulado** (`login.html`).
- **Tela principal** (`app.html`): lista de concursos + mapa do Brasil lado a lado, com busca, ordenação, abas por status e filtro por estado (clicando no mapa).
- **Detalhe do concurso** (`concurso.html`): dados completos, edital, botão de favoritar e de acompanhar prazo.
- **Calendário de provas** (`calendario.html`): provas agrupadas por mês, com aviso de prazo próximo.
- **Favoritos** (`favoritos.html`) e **Alertas** (`alertas.html`): concursos marcados pelo usuário.
- **Meu Perfil** (`perfil.html`): tela simples com dados do usuário logado.

## Como rodar localmente

Não há build, npm ou dependências — é HTML/CSS/JS puro. Basta servir a pasta por HTTP (não abrir os arquivos direto com `file://`, pois o `fetch()` do JSON e do SVG não funciona nesse modo em todos os navegadores).

```bash
cd Projetos/vertice/clientes/felipe-nunes/cfc-academy/mapa-concursos
python -m http.server 8000
```

Depois abra **http://localhost:8000/** no navegador.

## Onde ficam os dados

Todos os concursos exibidos vêm de um único arquivo:

```
data/concursos.json
```

É um array de objetos. Não há banco de dados nem API nesta fase — o arquivo é carregado via `fetch()` por `js/data.js`.

### Como adicionar um concurso

Adicione um novo objeto ao array em `data/concursos.json`, seguindo o formato:

```json
{
  "id": "conc-identificador-unico-2026",
  "orgao": "Nome do órgão/prefeitura/tribunal",
  "cargo": "Contador",
  "banca": "Nome da banca organizadora",
  "uf": "PB",
  "cidade": "Nome da cidade",
  "vagas": "1",
  "salario": 4856.66,
  "salarioObs": "",
  "cargaHoraria": "40h",
  "status": "aberto",
  "inscricaoInicio": "2026-08-19T08:00",
  "inscricaoFim": "2026-09-18T16:00",
  "dataProva": "2026-10-17",
  "localProva": "Cidade/UF",
  "atualizadoEm": "2026-06-21",
  "editalUrl": "https://exemplo.gov.br/edital.pdf"
}
```

Observações sobre os campos:

- `id`: identificador único (string), usado por favoritos/alertas e pela URL de detalhe (`concurso.html?id=...`). Nunca reutilize um `id` já existente.
- `uf`: sigla de 2 letras, usada para colorir o mapa (deve bater com o `id` dos estados em `assets/brasil.svg`).
- `status`: `"aberto"`, `"encerrado"` ou outro valor livre (exibido como "Outros").
- `dataProva`, `atualizadoEm`: datas **sem horário**, no formato `AAAA-MM-DD`.
- `inscricaoInicio`, `inscricaoFim`: podem incluir horário, no formato `AAAA-MM-DDTHH:mm`.
- `salario`: número (use `null` se não divulgado) — `salarioObs` complementa em texto (ex.: "+ benefícios").
- `vagas`: string livre (aceita "1", "2 + CR" etc.).
- `localProva`, `editalUrl`: opcionais/livres.

Não é necessário reiniciar nada — a lista é lida do JSON a cada carregamento da página.

## O que é simulado nesta fase

Esta é uma fase **somente de front-end**, sem servidor de aplicação nem banco de dados:

- **Login/cadastro**: não valida senha nem cria conta de verdade. Qualquer e-mail "loga" e fica salvo no `localStorage` do navegador.
- **Favoritos** e **alertas de prazo**: guardados no `localStorage` (chaves `cfc_user`, `cfc_fav`, `cfc_alerta` — ver `js/store.js`). Cada navegador/dispositivo tem sua própria lista; não há sincronização entre dispositivos nem persistência real em conta de usuário.
- **Botão "Grupo" (WhatsApp)**: é um placeholder (`href="#"`) até que o link real do grupo da CFC seja definido.
- **Notificações de prazo**: o "alerta" apenas destaca o concurso nas telas de Alertas/Calendário (badge "Em Xd"); não há envio de e-mail, push ou WhatsApp.

## O que fica para a fase 2

- Autenticação real (senha, verificação de e-mail, sessão/JWT).
- Backend com banco de dados para concursos, usuários, favoritos e alertas (substituindo `concursos.json` e `localStorage`).
- Painel administrativo para cadastrar/editar concursos sem editar o JSON manualmente.
- Integração real com WhatsApp/Grupo (link definitivo e possivelmente bot de notificação).
- Notificações de fato (e-mail, push ou WhatsApp) quando um prazo acompanhado estiver próximo.
- Refinamento visual quando a identidade da CFC (logo, cores, print de perfil) for definida — ver notas de handoff do projeto.

## Créditos

O mapa SVG do Brasil (`assets/brasil.svg`) é baseado no projeto [luisdalmolin/mapa-brasil-svg](https://github.com/luisdalmolin/mapa-brasil-svg), licenciado sob **MIT**.
