import Database from 'better-sqlite3';

const db = new Database('marketplace.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
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
  );

  CREATE TABLE IF NOT EXISTS nft_templates (
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
  );

  CREATE TABLE IF NOT EXISTS nfts (
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
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nft_id INTEGER NOT NULL,
    from_account TEXT NOT NULL,
    to_account TEXT NOT NULL,
    price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nft_id) REFERENCES nfts(id)
  );

  CREATE TABLE IF NOT EXISTS payment_logs (
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
  );

  CREATE TABLE IF NOT EXISTS pending_purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nft_id INTEGER NOT NULL,
    buyer_account_id TEXT NOT NULL,
    expected_amount REAL NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nft_id) REFERENCES nfts(id)
  );
`);

export function createNFTRecord(tokenId, serialNumber, ownerAccountId, metadataCID) {
  const stmt = db.prepare('INSERT INTO nfts (token_id, serial_number, owner_account_id, metadata_cid) VALUES (?, ?, ?, ?)');
  return stmt.run(tokenId, serialNumber, ownerAccountId, metadataCID).lastInsertRowid;
}

export function getNFTsByOwner(ownerAccountId) {
  const stmt = db.prepare('SELECT * FROM nfts WHERE owner_account_id = ? ORDER BY created_at DESC');
  return stmt.all(ownerAccountId);
}

export function listNFTForSale(nftId, price, ownerAccountId) {
  const stmt = db.prepare('UPDATE nfts SET listed_for_sale = 1, price = ? WHERE id = ? AND owner_account_id = ?');
  return stmt.run(price, nftId, ownerAccountId);
}

export function getListedNFTs() {
  const stmt = db.prepare('SELECT * FROM nfts WHERE listed_for_sale = 1 ORDER BY created_at DESC');
  return stmt.all();
}

export function purchaseNFT(nftId, buyerAccountId) {
  const nft = db.prepare('SELECT * FROM nfts WHERE id = ?').get(nftId);
  
  if (!nft || !nft.listed_for_sale) {
    throw new Error('NFT not available for purchase');
  }

  db.prepare('UPDATE nfts SET owner_account_id = ?, listed_for_sale = 0, price = 0 WHERE id = ?')
    .run(buyerAccountId, nftId);

  db.prepare('INSERT INTO transactions (nft_id, from_account, to_account, price) VALUES (?, ?, ?, ?)')
    .run(nftId, nft.owner_account_id, buyerAccountId, nft.price);

  return { seller: nft.owner_account_id, price: nft.price };
}

export function logPayment(nftId, buyerAccountId, sellerAccountId, amount, status, paymentTxId = null, forwardTxId = null, errorMessage = null) {
  const stmt = db.prepare('INSERT INTO payment_logs (nft_id, buyer_account_id, seller_account_id, amount, status, payment_tx_id, forward_tx_id, error_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  return stmt.run(nftId, buyerAccountId, sellerAccountId, amount, status, paymentTxId, forwardTxId, errorMessage).lastInsertRowid;
}

export function getFailedPayments() {
  return db.prepare('SELECT * FROM payment_logs WHERE status IN ("PAYMENT_RECEIVED", "FORWARD_FAILED") ORDER BY created_at DESC').all();
}

export function createPendingPurchase(nftId, buyerAccountId, expectedAmount) {
  const stmt = db.prepare('INSERT INTO pending_purchases (nft_id, buyer_account_id, expected_amount) VALUES (?, ?, ?)');
  return stmt.run(nftId, buyerAccountId, expectedAmount).lastInsertRowid;
}

export function getPendingPurchases() {
  return db.prepare('SELECT * FROM pending_purchases WHERE status = "PENDING" AND created_at > datetime("now", "-10 minutes") ORDER BY created_at ASC').all();
}

export function updatePendingPurchaseStatus(id, status) {
  db.prepare('UPDATE pending_purchases SET status = ? WHERE id = ?').run(status, id);
}

// Game functions
export function registerGame(name, description, developerAccountId, royaltyPercentage, logoUrl, websiteUrl) {
  const apiKey = 'gn_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const stmt = db.prepare('INSERT INTO games (name, description, developer_account_id, api_key, royalty_percentage, logo_url, website_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(name, description, developerAccountId, apiKey, royaltyPercentage || 5.0, logoUrl, websiteUrl);
  return { gameId: result.lastInsertRowid, apiKey };
}

export function updateGameTokenId(gameId, tokenId) {
  const stmt = db.prepare('UPDATE games SET token_id = ? WHERE id = ?');
  stmt.run(tokenId, gameId);
}

export function getGameByApiKey(apiKey) {
  return db.prepare('SELECT * FROM games WHERE api_key = ?').get(apiKey);
}

export function getGamesByDeveloper(developerAccountId) {
  return db.prepare('SELECT * FROM games WHERE developer_account_id = ? ORDER BY created_at DESC').all(developerAccountId);
}

export function getAllGames() {
  return db.prepare('SELECT * FROM games ORDER BY created_at DESC').all();
}

// Template functions
export function createTemplate(gameId, templateId, name, description, imageUrl, type, rarity, attributes) {
  const stmt = db.prepare('INSERT INTO nft_templates (game_id, template_id, name, description, image_url, type, rarity, attributes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(gameId, templateId, name, description, imageUrl, type, rarity, JSON.stringify(attributes));
  return result.lastInsertRowid;
}

export function getTemplatesByGame(gameId) {
  const templates = db.prepare('SELECT * FROM nft_templates WHERE game_id = ? ORDER BY created_at DESC').all(gameId);
  return templates.map(t => ({ ...t, attributes: JSON.parse(t.attributes || '{}') }));
}

export function getTemplate(gameId, templateId) {
  const template = db.prepare('SELECT * FROM nft_templates WHERE game_id = ? AND template_id = ?').get(gameId, templateId);
  if (template) template.attributes = JSON.parse(template.attributes || '{}');
  return template;
}

export default db;
