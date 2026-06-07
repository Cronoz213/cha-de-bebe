const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new DatabaseSync(path.join(dbDir, 'cha-de-bebe.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS rsvp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    vai_comparecer INTEGER NOT NULL,
    criado_em TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS presentes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    valor REAL NOT NULL,
    link_compra TEXT,
    foto_url TEXT,
    escolhido_por TEXT DEFAULT NULL,
    criado_em TEXT DEFAULT (datetime('now'))
  );
`);

const countStmt = db.prepare('SELECT COUNT(*) as total FROM presentes');
const count = countStmt.get();
if (count.total === 0) {
  const insert = db.prepare(
    'INSERT INTO presentes (nome, valor, link_compra, foto_url) VALUES (?, ?, ?, ?)'
  );

  const presentes = [
    ['Kit Higiene Bebê', 89.90, 'https://www.amazon.com.br/s?k=kit+higiene+bebe', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80'],
    ['Manta de Bebê Soft', 59.90, 'https://www.amazon.com.br/s?k=manta+bebe+soft', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80'],
    ['Banheira Ergonômica', 149.90, 'https://www.amazon.com.br/s?k=banheira+bebe+ergonomica', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80'],
    ['Body Estampado (Kit 5 peças)', 79.90, 'https://www.amazon.com.br/s?k=body+bebe+estampado+kit', 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&q=80'],
    ['Carrinho de Bebê Compacto', 899.90, 'https://www.amazon.com.br/s?k=carrinho+bebe+compacto', 'https://images.unsplash.com/photo-1586005100802-0e2c1deea0e8?w=400&q=80'],
    ['Cadeirinha para Carro', 499.90, 'https://www.amazon.com.br/s?k=cadeirinha+carro+bebe', 'https://images.unsplash.com/photo-1491349174775-aaaefdd81942?w=400&q=80'],
    ['Brinquedo Chocalho Colorido', 39.90, 'https://www.amazon.com.br/s?k=chocalho+bebe+colorido', 'https://images.unsplash.com/photo-1558171813-3f12e54eeb43?w=400&q=80'],
    ['Conjunto de Fraldas Premium', 129.90, 'https://www.amazon.com.br/s?k=fralda+premium+recem+nascido', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80'],
  ];

  for (const [nome, valor, link_compra, foto_url] of presentes) {
    insert.run(nome, valor, link_compra, foto_url);
  }
}

module.exports = db;
