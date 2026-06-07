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

  const base = process.env.SERVER_URL || 'http://localhost:3001';

  const presentes = [
    ['Macacão Curto Verão (Tam. P ou M)', 29.9, 'https://shopee.com.br/product/435692544/20497302498?d_id=8a4a3&uls_trackid=55pkpi63010i&utm_content=h36Cy4wQNPoiQdWgowrba8du3b5', `${base}/uploads/1780280739804-52n35fawc2l.png`],
    ['Naninha astronauta', 91.11, 'https://shopee.com.br/product/218849666/22297756364?d_id=8a4a3&uls_trackid=55pkprjv004k&utm_content=h36Cy4wBVMpZiJqXYFPNioCC3fu', `${base}/uploads/1780280780953-61lwd1um8gr.png`],
    ['Tapete Infantil Astronauta', 56.84, 'https://shopee.com.br/product/1509685885/50305628729?d_id=8a4a3&uls_trackid=55pkpv930024&utm_content=h36Cy4wBUWbUjbdw6bNzuwi6wbV', `${base}/uploads/1780280813942-ej39c7u3e2a.png`],
    ['Cortina Espaço Estrelado', 81.61, 'https://shopee.com.br/product/375662462/22297606674?d_id=9ac63&uls_trackid=55pkq6ha000c&utm_content=4HWfbAtXymazbhxyW3mdJUT2UHNw', `${base}/uploads/1780280896623-4aloe86u7jh.png`],
    ['Cômoda Infantil 4 Gavetas Com Fraldário', 591.24, 'https://produto.mercadolivre.com.br/MLB-5327331894-cmoda-infantil-4-gavetas-com-fraldario-selena-carolina-baby-_JM?matt_tool=38524122#origin=whatsapp&sid=whatsapp', `${base}/uploads/1780280925300-j6pw119b4f.png`],
    ['Burigotto Berço Serenata', 449.9, 'https://www.amazon.com.br/dp/B0C5MZS8J4?ref=cm_sw_r_cso_wa_mwn_dp_9PHJ144EM0KRRXKCS0FH&ref_=cm_sw_r_cso_wa_mwn_dp_9PHJ144EM0KRRXKCS0FH&social_share=cm_sw_r_cso_wa_mwn_dp_9PHJ144EM0KRRXKCS0FH&th=1', `${base}/uploads/1780862048372-yvobj5m2z3.png`],
    ['Almofada Amamentação', 69.9, 'https://shopee.com.br/product/441226067/22193909575?d_id=8a4a3&uls_trackid=55pkqiom0068&utm_content=h36Cy4wBRTWu8J3yoBciEhGEgbR', `${base}/uploads/1780281006999-hko8ytfyru.png`],
    ['Manta Infantil Astronauta', 24.9, 'https://shopee.com.br/product/1545153643/58256553865?d_id=8a4a3&uls_trackid=55pkqlke0066&utm_content=h36Cy4wBRMSEvaZ4xsUcX7NsLeK', `${base}/uploads/1780281084627-4l8f11og2ie.png`],
    ['Tapete de Atividade Musical', 69.99, 'https://shopee.com.br/product/823576234/18799076595?d_id=8a4a3&uls_trackid=55pkqnsu000c&utm_content=h36Cy4wBRKGdsCd5DSk1B8xecEB', `${base}/uploads/1780281108781-zyjgy0ykx7m.png`],
    ['Banheira Dobrável Com Suporte', 449.91, 'https://shopee.com.br/product/1409811653/22899437352?d_id=8a4a3&uls_trackid=55rc1i8i000i&utm_content=h36Cy4wv7yEUJ9aAYrnQVGBYXeF', `${base}/uploads/1780860009780-oxz1z0lq3ql.png`],
    ['Kit Higiene Astronauta', 61.9, 'https://shopee.com.br/product/648928964/22496917865?d_id=8a4a3&uls_trackid=55pkr1vr000h&utm_content=h36Cy4wBQvVoiA1a7crRuj75i9m', `${base}/uploads/1780281166041-0xy3cxkcaopj.png`],
    ['Cueiro Flanelado', 38.9, 'https://shopee.com.br/product/270045485/23094640246?d_id=8a4a3&uls_trackid=55pkr58k005b&utm_content=h36Cy4wBQsCYyNzWYjWkBxo1p63', `${base}/uploads/1780281195943-o9gmktxiv8.png`],
    ['Kit Fralda de Pano Bordada', 93.96, 'https://shopee.com.br/product/826657101/58252714698?d_id=8a4a3&uls_trackid=55pkr7pn0057&utm_content=h36Cy4wBQn32unYNDwv4ULKZKYs', `${base}/uploads/1780281221855-l75hb54m9si.png`],
    ['Toalha Bordada', 28.9, 'https://shopee.com.br/product/417839224/20804250594?d_id=8a4a3&uls_trackid=55pkrjh30066&utm_content=h36Cy4wBQkkawxKbFCYgvdSQE4P', `${base}/uploads/1780281346088-j2ridiu69g.png`],
    ['Cesto De Roupas', 85.41, 'https://shopee.com.br/product/404739832/23397363715?d_id=8a4a3&uls_trackid=55pkrmmu010h&utm_content=h36Cy4wBQfAuuwaNWStGbdWPYgF', `${base}/uploads/1780281377406-kpkcj8ont5o.png`],
    ['Kit Cabelo', 35.99, 'https://br.shein.com/CozyPixies3Pe%C3%A7asConjuntodeCuidadoscomoBeb%C3%AAcomEscovadeLãdeMadeira-p-62581342-cat-4749.html', `${base}/uploads/1780281419551-bzqtycjaild.png`],
    ['Toalhas De Banho Com Capuz', 69.59, 'https://br.shein.com/2Pe%C3%A7asToalhasDeBanhoComCapuzDeFelpaDeCoralParaBeb%C3%AAUnissex-p-30969041-cat-11544.html', `${base}/uploads/1780281473680-9rno4g4bv96.png`],
    ['Roupão de Banho', 51.93, 'https://br.shein.com/1Pe%C3%A7aRoup%C3%A3odeBanhodeFelpodeCoralMacio-p-24949623-cat-11544.html', `${base}/uploads/1780281502800-2q0eqj8kqpj.png`],
    ['Lixeira Antiodor', 151.86, 'https://www.mercadolivre.com.br/lixeira-antiodor-descarte-de-fraldas-lixo-magico-maxi-baby/p/MLB35343856', `${base}/uploads/1780281555709-abrybz7vj6t.png`],
    ['NINHO REDUTOR DE BERÇO cor: marinho', 59.99, 'https://shopee.com.br/product/284123836/46158429289?d_id=8a4a3&uls_trackid=55rc9fc6001e&utm_content=h36Cy4x5JXmorkQxGqXbG9EvTLs', `${base}/uploads/1780862611974-mqy847plch.png`],
    ['Combo Boti Baby Lua: Colônia Para Bebê 100ml + Loção Corporal Banho e Pós-Banho 200ml', 162.8, 'https://www.boticario.com.br/combo-boti-baby-lua-colonia-para-bebe-100ml-locao-corporal-banho-e-posbanho-200ml?utm_source=compartilhar&utm_medium=site&utm_campaign=aon', `${base}/uploads/1780281641903-5yw8xn73yi.png`],
    ['Combo Boti Baby Banho Completo (5 itens)', 329.9, 'https://www.boticario.com.br/combo-boti-baby-banho-completo-5-itens?utm_source=compartilhar&utm_medium=site&utm_campaign=aon', `${base}/uploads/1780281680674-040sy86ge3z4.png`],
    ['Caderneta de Vacina', 29.99, 'https://shopee.com.br/product/430047667/23692774495?d_id=8a4a3&uls_trackid=55pks6fj015b&utm_content=h36Cy4wBHJqK4stco4adXswGCcF', `${base}/uploads/1780281710289-3m7lvw21dl.png`],
    ['Colchão Bebe para Berço', 122.55, 'https://shopee.com.br/product/770333274/20599047323', `${base}/uploads/1780281733699-qb0vbhd9agd.png`],
    ['Body 3 peças Trijunto Verão Menino (Tam. P ou M)', 37.9, 'https://shopee.com.br/product/1507176295/22394255460?d_id=8a4a3&uls_trackid=55pku3qc000h&utm_content=h36Cy4wpvuejaWA2B5rVs2Ad4dV', `${base}/uploads/1780282180774-u60pxcbx1dd.png`],
    ['Conjunto Jardineira estampada 2 peças (Tam. P ou M)', 39.9, 'https://shopee.com.br/product/1507176295/22594289004?d_id=8a4a3&uls_trackid=55pku3j5004k&utm_content=h36Cy4wpvtZw3pC2JNVCcM7ZaAs', `${base}/uploads/1780282202398-liewvq86pn.png`],
    ['Naninha Infantil', 29.9, 'https://shopee.com.br/product/481935855/23998623755?d_id=8a4a3&uls_trackid=55pku3cg0157&utm_content=h36Cy4wpvry2UsGLGa9vW2QuLwh', `${base}/uploads/1780282234978-6by8a8xk5fr.png`],
    ['Roupas De Verão Botão De Manga Curta (Tam. P ou M)', 65, 'https://shopee.com.br/product/237563320/19397408747?d_id=8a4a3&uls_trackid=55pku3660066&utm_content=h36Cy4wpvpzCgcTZwrjXPGf2cMd', `${base}/uploads/1780282261482-vys4fvlcxfk.png`],
    ['Porta Maternidade Astronauta', 45.99, 'https://shopee.com.br/product/252864526/22197715059?d_id=8a4a3&uls_trackid=55pkugbd0057&utm_content=h36Cy4wpw19aRESdEF6vthaUMWP', `${base}/uploads/1780282293115-xl14tfealer.png`],
    ['Kit 10 Pçs Body E Shorts Bebê (Tam. P ou M)', 73.99, 'https://shopee.com.br/product/410769827/13220336315?d_id=8a4a3&uls_trackid=55pkugj5014k&utm_content=h36Cy4wpwAUeD1qXghLsUsrCP5y', `${base}/uploads/1780282313256-72w5qb20l7k.png`],
    ['Kit 3 lençol avulso para chiqueirinho, cor: branco azul e cinza', 57.86, 'https://shopee.com.br/product/446109173/18731517101?d_id=8a4a3&uls_trackid=55rc9o1v00an&utm_content=h36Cy4x5JesAzDjbGDvsuwtJuEf', `${base}/uploads/1780862711230-t5fdwjhurod.png`],
  ];

  for (const [nome, valor, link_compra, foto_url] of presentes) {
    insert.run(nome, valor, link_compra, foto_url);
  }
}

module.exports = db;
