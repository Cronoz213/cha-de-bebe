require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('ERRO: ADMIN_PASSWORD não definido no .env');
  process.exit(1);
}

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Apenas imagens são permitidas'));
    cb(null, true);
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// --- Tokens de sessão (memória, limpos ao reiniciar) ---
const validTokens = new Set();

// --- Rate limiting simples por IP ---
const rateLimitMap = new Map();

function rateLimit(maxReqs, windowMs) {
  return (req, res, next) => {
    const key = req.ip + req.path;
    const now = Date.now();
    const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
    entry.count++;
    rateLimitMap.set(key, entry);
    if (entry.count > maxReqs) {
      return res.status(429).json({ error: 'Muitas tentativas. Aguarde e tente novamente.' });
    }
    next();
  };
}

// --- Middleware de autenticação admin ---
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || !validTokens.has(token)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
}

// ==================== AUTH ====================

// POST /api/admin/login — valida senha, retorna token de sessão
app.post('/api/admin/login', rateLimit(5, 15 * 60 * 1000), (req, res) => {
  const { senha } = req.body;
  if (!senha || senha !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  validTokens.add(token);
  res.json({ token });
});

// POST /api/admin/logout — invalida o token
app.post('/api/admin/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) validTokens.delete(token);
  res.json({ success: true });
});

// ==================== ROTAS PÚBLICAS ====================

// GET /api/presentes — retorna lista sem expor quem escolheu
app.get('/api/presentes', (req, res) => {
  const rows = db.prepare('SELECT id, nome, valor, link_compra, foto_url, escolhido_por FROM presentes ORDER BY criado_em ASC').all();
  const result = rows.map(({ escolhido_por, ...rest }) => ({
    ...rest,
    escolhido: escolhido_por !== null,
  }));
  res.json(result);
});

// PATCH /api/presentes/:id/escolher — marca presente como escolhido
app.patch('/api/presentes/:id/escolher', rateLimit(10, 60 * 60 * 1000), (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  const presente = db.prepare('SELECT * FROM presentes WHERE id = ?').get(id);
  if (!presente) {
    return res.status(404).json({ error: 'Presente não encontrado' });
  }
  if (presente.escolhido_por !== null) {
    return res.status(409).json({ error: 'Este presente já foi escolhido' });
  }

  db.prepare('UPDATE presentes SET escolhido_por = ? WHERE id = ?').run(nome.trim(), id);
  res.json({ success: true, message: 'Presente escolhido com sucesso!' });
});

// POST /api/rsvp — salva confirmação de presença
app.post('/api/rsvp', rateLimit(5, 60 * 60 * 1000), (req, res) => {
  const { nome, vai_comparecer } = req.body;

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  if (vai_comparecer === undefined || vai_comparecer === null) {
    return res.status(400).json({ error: 'Confirmação de presença é obrigatória' });
  }

  const vai = vai_comparecer ? 1 : 0;
  db.prepare('INSERT INTO rsvp (nome, vai_comparecer) VALUES (?, ?)').run(nome.trim(), vai);
  res.status(201).json({ success: true, message: 'Presença confirmada com sucesso!' });
});

// ==================== ROTAS ADMIN ====================

// POST /api/admin/upload — faz upload de imagem e retorna a URL
app.post('/api/admin/upload', requireAdmin, upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  const baseUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ url });
});

// GET /api/admin/presentes — lista completa com quem escolheu
app.get('/api/admin/presentes', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM presentes ORDER BY criado_em ASC').all();
  res.json(rows);
});

// POST /api/admin/presentes — adiciona presente
app.post('/api/admin/presentes', requireAdmin, (req, res) => {
  const { nome, valor, link_compra, foto_url } = req.body;
  if (!nome || valor === undefined) {
    return res.status(400).json({ error: 'Nome e valor são obrigatórios' });
  }
  const result = db.prepare(
    'INSERT INTO presentes (nome, valor, link_compra, foto_url) VALUES (?, ?, ?, ?)'
  ).run(nome.trim(), parseFloat(valor), link_compra || null, foto_url || null);

  const novo = db.prepare('SELECT * FROM presentes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(novo);
});

// PUT /api/admin/presentes/:id — edita presente
app.put('/api/admin/presentes/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { nome, valor, link_compra, foto_url } = req.body;

  const presente = db.prepare('SELECT * FROM presentes WHERE id = ?').get(id);
  if (!presente) return res.status(404).json({ error: 'Presente não encontrado' });

  db.prepare(
    'UPDATE presentes SET nome = ?, valor = ?, link_compra = ?, foto_url = ? WHERE id = ?'
  ).run(
    nome?.trim() || presente.nome,
    valor !== undefined ? parseFloat(valor) : presente.valor,
    link_compra ?? presente.link_compra,
    foto_url ?? presente.foto_url,
    id
  );

  const atualizado = db.prepare('SELECT * FROM presentes WHERE id = ?').get(id);
  res.json(atualizado);
});

// DELETE /api/admin/presentes/:id — exclui presente
app.delete('/api/admin/presentes/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const presente = db.prepare('SELECT * FROM presentes WHERE id = ?').get(id);
  if (!presente) return res.status(404).json({ error: 'Presente não encontrado' });
  db.prepare('DELETE FROM presentes WHERE id = ?').run(id);
  res.json({ success: true });
});

// GET /api/admin/rsvp — lista todos os RSVPs
app.get('/api/admin/rsvp', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM rsvp ORDER BY criado_em DESC').all();
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
