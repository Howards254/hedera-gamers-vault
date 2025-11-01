import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

await db.execute(`CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  developer_account_id TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  token_id TEXT,
  royalty_percentage REAL DEFAULT 5.0,
  logo_url TEXT,
  website_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS nft_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  template_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  type TEXT,
  rarity TEXT,
  attributes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id),
  UNIQUE(game_id, template_id)
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS nfts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_id TEXT NOT NULL,
  serial_number INTEGER NOT NULL,
  owner_account_id TEXT NOT NULL,
  metadata_cid TEXT NOT NULL,
  game_id INTEGER,
  template_id TEXT,
  listed_for_sale INTEGER DEFAULT 0,
  price REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id)
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nft_id INTEGER NOT NULL,
  from_account TEXT NOT NULL,
  to_account TEXT NOT NULL,
  price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nft_id) REFERENCES nfts(id)
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS payment_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nft_id INTEGER NOT NULL,
  buyer_account_id TEXT NOT NULL,
  seller_account_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  payment_tx_id TEXT,
  forward_tx_id TEXT,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nft_id) REFERENCES nfts(id)
)`);

await db.execute(`CREATE TABLE IF NOT EXISTS pending_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nft_id INTEGER NOT NULL,
  buyer_account_id TEXT NOT NULL,
  expected_amount REAL NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nft_id) REFERENCES nfts(id)
)`);

export async function createNFTRecord(tokenId, serialNumber, ownerAccountId, metadataCID) {
  const result = await db.execute({
    sql: 'INSERT INTO nfts (token_id, serial_number, owner_account_id, metadata_cid) VALUES (?, ?, ?, ?)',
    args: [tokenId, serialNumber, ownerAccountId, metadataCID]
  });
  return result.lastInsertRowid;
}

export async function getNFTsByOwner(ownerAccountId) {
  const result = await db.execute({
    sql: 'SELECT * FROM nfts WHERE owner_account_id = ? ORDER BY created_at DESC',
    args: [ownerAccountId]
  });
  return result.rows;
}

export async function listNFTForSale(nftId, price, ownerAccountId) {
  await db.execute({
    sql: 'UPDATE nfts SET listed_for_sale = 1, price = ? WHERE id = ? AND owner_account_id = ?',
    args: [price, nftId, ownerAccountId]
  });
}

export async function delistNFT(nftId, ownerAccountId) {
  await db.execute({
    sql: 'UPDATE nfts SET listed_for_sale = 0, price = NULL WHERE id = ? AND owner_account_id = ?',
    args: [nftId, ownerAccountId]
  });
}

export async function getListedNFTs() {
  const result = await db.execute('SELECT * FROM nfts WHERE listed_for_sale = 1 ORDER BY created_at DESC');
  return result.rows;
}

export async function purchaseNFT(nftId, buyerAccountId) {
  const result = await db.execute({
    sql: 'SELECT * FROM nfts WHERE id = ?',
    args: [nftId]
  });
  const nft = result.rows[0];
  
  if (!nft || !nft.listed_for_sale) {
    throw new Error('NFT not available for purchase');
  }

  await db.execute({
    sql: 'UPDATE nfts SET owner_account_id = ?, listed_for_sale = 0, price = 0 WHERE id = ?',
    args: [buyerAccountId, nftId]
  });

  await db.execute({
    sql: 'INSERT INTO transactions (nft_id, from_account, to_account, price) VALUES (?, ?, ?, ?)',
    args: [nftId, nft.owner_account_id, buyerAccountId, nft.price]
  });

  return { seller: nft.owner_account_id, price: nft.price };
}

export async function logPayment(nftId, buyerAccountId, sellerAccountId, amount, status, paymentTxId = null, forwardTxId = null, errorMessage = null) {
  const result = await db.execute({
    sql: 'INSERT INTO payment_logs (nft_id, buyer_account_id, seller_account_id, amount, status, payment_tx_id, forward_tx_id, error_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [nftId, buyerAccountId, sellerAccountId, amount, status, paymentTxId, forwardTxId, errorMessage]
  });
  return result.lastInsertRowid;
}

export async function getFailedPayments() {
  const result = await db.execute("SELECT * FROM payment_logs WHERE status IN ('PAYMENT_RECEIVED', 'FORWARD_FAILED') ORDER BY created_at DESC");
  return result.rows;
}

export async function createPendingPurchase(nftId, buyerAccountId, expectedAmount) {
  const result = await db.execute({
    sql: 'INSERT INTO pending_purchases (nft_id, buyer_account_id, expected_amount) VALUES (?, ?, ?)',
    args: [nftId, buyerAccountId, expectedAmount]
  });
  return result.lastInsertRowid;
}

export async function getPendingPurchases() {
  const result = await db.execute("SELECT * FROM pending_purchases WHERE status = 'PENDING' AND created_at > datetime('now', '-10 minutes') ORDER BY created_at ASC");
  return result.rows;
}

export async function updatePendingPurchaseStatus(id, status) {
  await db.execute({
    sql: 'UPDATE pending_purchases SET status = ? WHERE id = ?',
    args: [status, id]
  });
}

// Game functions
export async function registerGame(name, description, developerAccountId, royaltyPercentage, logoUrl, websiteUrl) {
  const apiKey = 'gn_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const result = await db.execute({
    sql: 'INSERT INTO games (name, description, developer_account_id, api_key, royalty_percentage, logo_url, website_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [name, description, developerAccountId, apiKey, royaltyPercentage || 5.0, logoUrl, websiteUrl]
  });
  return { gameId: result.lastInsertRowid, apiKey };
}

export async function updateGameTokenId(gameId, tokenId) {
  await db.execute({
    sql: 'UPDATE games SET token_id = ? WHERE id = ?',
    args: [tokenId, gameId]
  });
}

export async function getGameByApiKey(apiKey) {
  const result = await db.execute({
    sql: 'SELECT * FROM games WHERE api_key = ?',
    args: [apiKey]
  });
  return result.rows[0];
}

export async function getGamesByDeveloper(developerAccountId) {
  const result = await db.execute({
    sql: 'SELECT * FROM games WHERE developer_account_id = ? ORDER BY created_at DESC',
    args: [developerAccountId]
  });
  return result.rows;
}

export async function getAllGames() {
  const result = await db.execute('SELECT * FROM games ORDER BY created_at DESC');
  return result.rows;
}

// Template functions
export async function createTemplate(gameId, templateId, name, description, imageUrl, type, rarity, attributes) {
  const result = await db.execute({
    sql: 'INSERT INTO nft_templates (game_id, template_id, name, description, image_url, type, rarity, attributes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [gameId, templateId, name, description, imageUrl, type, rarity, JSON.stringify(attributes)]
  });
  return result.lastInsertRowid;
}

export async function getTemplatesByGame(gameId) {
  const result = await db.execute({
    sql: 'SELECT * FROM nft_templates WHERE game_id = ? ORDER BY created_at DESC',
    args: [gameId]
  });
  return result.rows.map(t => ({ ...t, attributes: JSON.parse(t.attributes || '{}') }));
}

export async function getTemplate(gameId, templateId) {
  const result = await db.execute({
    sql: 'SELECT * FROM nft_templates WHERE game_id = ? AND template_id = ?',
    args: [gameId, templateId]
  });
  const template = result.rows[0];
  if (template) template.attributes = JSON.parse(template.attributes || '{}');
  return template;
}

export default db;
