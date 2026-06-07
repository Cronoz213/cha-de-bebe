# Chá de Bebê — Site Completo

Site para organização de chá de bebê com confirmação de presença, lista de presentes e painel administrativo.

## Estrutura

```
cha-de-bebe/
├── client/   → Frontend React + Vite + Tailwind CSS
└── server/   → Backend Node.js + Express + SQLite
```

## Como Rodar

### 1. Backend (porta 3001)

```bash
cd server
npm install
npm run dev
```

### 2. Frontend (porta 5173)

```bash
cd client
npm install
npm run dev
```

Acesse: http://localhost:5173

## Convite PDF

Coloque o arquivo `convite.pdf` em `client/public/convite.pdf`.
Ele será exibido automaticamente na página inicial.

## Configurações

- **Senha admin:** definida em `server/.env` como `ADMIN_PASSWORD=admin123`
- **Área admin:** acesse `/admin` no site e use a senha configurada

## Páginas

| Rota     | Descrição                          |
|----------|------------------------------------|
| `/`      | Página inicial com convite PDF      |
| `rsvp`   | Confirmação de presença             |
| `presentes` | Lista de presentes              |
| `localizacao` | Endereço e mapa              |
| `/admin` | Painel administrativo (com senha)   |

## API

| Método | Rota                           | Descrição                      |
|--------|--------------------------------|--------------------------------|
| GET    | /api/presentes                 | Lista pública de presentes     |
| PATCH  | /api/presentes/:id/escolher    | Marcar presente como escolhido |
| POST   | /api/rsvp                      | Confirmar presença             |
| GET    | /api/admin/rsvp                | Lista de confirmações (admin)  |
| GET    | /api/admin/presentes           | Lista completa (admin)         |
| POST   | /api/admin/presentes           | Adicionar presente (admin)     |
| PUT    | /api/admin/presentes/:id       | Editar presente (admin)        |
| DELETE | /api/admin/presentes/:id       | Excluir presente (admin)       |

## Tecnologias

- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express
- **Banco de dados:** SQLite via `node:sqlite` (built-in do Node.js 22+)
- **Fontes:** Cormorant Garamond + Lato (Google Fonts)
